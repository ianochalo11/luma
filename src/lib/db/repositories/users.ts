import { resolveAdminEmail } from "@/constants/admin";
import { connectDb } from "@/lib/db/client";
import { UserModel, type UserDocument } from "@/lib/db/models";

export interface AppUserRecord {
  id: string;
  name: string;
  email: string;
  image: string | null;
  authProvider: "email" | "google" | "credentials" | "github" | "passkey";
  isAdmin: boolean;
  createdAt: string;
}

function toUserRecord(doc: UserDocument): AppUserRecord {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    image: doc.image ?? null,
    authProvider: (doc.authProvider ?? "email") as AppUserRecord["authProvider"],
    isAdmin: Boolean(doc.isAdmin),
    createdAt: doc.createdAt.toISOString(),
  };
}

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Guest";
  return local.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function findUserByEmail(email: string): Promise<AppUserRecord | null> {
  await connectDb();
  const doc = await UserModel.findOne({ email: email.toLowerCase().trim() });
  return doc ? toUserRecord(doc) : null;
}

export async function findUserById(id: string): Promise<AppUserRecord | null> {
  await connectDb();
  const doc = await UserModel.findById(id);
  return doc ? toUserRecord(doc) : null;
}

export async function updateUserName(
  id: string,
  name: string,
): Promise<AppUserRecord | null> {
  await connectDb();
  const trimmed = name.trim();
  if (!trimmed) return null;

  const doc = await UserModel.findByIdAndUpdate(
    id,
    { $set: { name: trimmed } },
    { new: true },
  );
  return doc ? toUserRecord(doc) : null;
}

export async function upsertUserOnSignIn(input: {
  email: string;
  name?: string | null;
  image?: string | null;
  authProvider: AppUserRecord["authProvider"];
}): Promise<AppUserRecord> {
  await connectDb();
  const email = input.email.toLowerCase().trim();
  const adminEmail = resolveAdminEmail();
  const shouldAdmin = Boolean(adminEmail && email === adminEmail);

  const existing = await UserModel.findOne({ email });
  if (existing) {
    let changed = false;
    if (input.name && existing.name !== input.name) {
      existing.name = input.name;
      changed = true;
    }
    if (input.image !== undefined && existing.image !== input.image) {
      existing.image = input.image;
      changed = true;
    }
    if (input.authProvider && existing.authProvider !== input.authProvider) {
      existing.authProvider = input.authProvider;
      changed = true;
    }
    if (existing.isAdmin !== shouldAdmin) {
      existing.isAdmin = shouldAdmin;
      changed = true;
    }
    if (changed) await existing.save();
    return toUserRecord(existing);
  }

  const created = await UserModel.create({
    email,
    name: input.name?.trim() || displayNameFromEmail(email),
    image: input.image ?? null,
    authProvider: input.authProvider,
    isAdmin: shouldAdmin,
  });

  return toUserRecord(created);
}

export async function listUsers(params: {
  page?: number;
  pageSize?: number;
  search?: string;
}): Promise<{ items: AppUserRecord[]; total: number; page: number; pageSize: number }> {
  await connectDb();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
  const filter = params.search
    ? {
        $or: [
          { email: { $regex: params.search, $options: "i" } },
          { name: { $regex: params.search, $options: "i" } },
        ],
      }
    : {};

  const [docs, total] = await Promise.all([
    UserModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    UserModel.countDocuments(filter),
  ]);

  return {
    items: docs.map(toUserRecord),
    total,
    page,
    pageSize,
  };
}
