import { connectDb } from "@/lib/db/client";
import { RegistrationModel, type RegistrationDocument } from "@/lib/db/models";
import { findUserById, type AppUserRecord } from "@/lib/db/repositories/users";
import type { RegistrationSchema } from "@/lib/validation/registrationSchema";

export interface RegistrationRecord {
  id: string;
  userId: string;
  eventId: string;
  eventSlug: string;
  form: RegistrationSchema;
  ticketStatus: "pending" | "confirmed" | "cancelled";
  paymentStatus: "unpaid" | "paid" | "refunded" | "failed";
  ticketPriceUsd: number;
  discountUsd: number;
  amountPaidUsd: number;
  accessCode: string | null;
  paymentSignature: string | null;
  walletAddress: string | null;
  createdAt: string;
  user?: AppUserRecord | null;
}

function toRegistrationRecord(
  doc: RegistrationDocument,
  user?: AppUserRecord | null,
): RegistrationRecord {
  return {
    id: String(doc._id),
    userId: doc.userId,
    eventId: doc.eventId,
    eventSlug: doc.eventSlug,
    form: doc.form as RegistrationSchema,
    ticketStatus: doc.ticketStatus as RegistrationRecord["ticketStatus"],
    paymentStatus: doc.paymentStatus as RegistrationRecord["paymentStatus"],
    ticketPriceUsd: doc.ticketPriceUsd,
    discountUsd: doc.discountUsd ?? 0,
    amountPaidUsd: doc.amountPaidUsd ?? 0,
    accessCode: doc.accessCode ?? null,
    paymentSignature: doc.paymentSignature ?? null,
    walletAddress: doc.walletAddress ?? null,
    createdAt: doc.createdAt.toISOString(),
    user: user ?? null,
  };
}

export async function createRegistration(input: {
  userId: string;
  eventId: string;
  eventSlug: string;
  form: RegistrationSchema;
  ticketPriceUsd: number;
  discountUsd?: number;
  amountPaidUsd?: number;
  accessCode?: string | null;
  paymentSignature?: string | null;
  walletAddress?: string | null;
  ticketStatus?: RegistrationRecord["ticketStatus"];
  paymentStatus?: RegistrationRecord["paymentStatus"];
}): Promise<RegistrationRecord> {
  await connectDb();
  const doc = await RegistrationModel.create({
    userId: input.userId,
    eventId: input.eventId,
    eventSlug: input.eventSlug,
    form: input.form,
    ticketPriceUsd: input.ticketPriceUsd,
    discountUsd: input.discountUsd ?? 0,
    amountPaidUsd: input.amountPaidUsd ?? 0,
    accessCode: input.accessCode ?? null,
    paymentSignature: input.paymentSignature ?? null,
    walletAddress: input.walletAddress ?? null,
    ticketStatus: input.ticketStatus ?? "confirmed",
    paymentStatus: input.paymentStatus ?? "paid",
  });
  return toRegistrationRecord(doc);
}

export async function listRegistrations(params: {
  page?: number;
  pageSize?: number;
  eventSlug?: string;
  paymentStatus?: RegistrationRecord["paymentStatus"];
  ticketStatus?: RegistrationRecord["ticketStatus"];
  search?: string;
  sort?: "createdAt" | "-createdAt" | "amountPaidUsd" | "-amountPaidUsd";
}): Promise<{
  items: RegistrationRecord[];
  total: number;
  page: number;
  pageSize: number;
}> {
  await connectDb();
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));

  const filter: Record<string, unknown> = {};
  if (params.eventSlug) filter.eventSlug = params.eventSlug;
  if (params.paymentStatus) filter.paymentStatus = params.paymentStatus;
  if (params.ticketStatus) filter.ticketStatus = params.ticketStatus;
  if (params.search) {
    filter.$or = [
      { "form.legalName": { $regex: params.search, $options: "i" } },
      { "form.company": { $regex: params.search, $options: "i" } },
      { userId: { $regex: params.search, $options: "i" } },
    ];
  }

  const sortKey = params.sort ?? "-createdAt";
  const sort: Record<string, 1 | -1> = sortKey.startsWith("-")
    ? { [sortKey.slice(1)]: -1 }
    : { [sortKey]: 1 };

  const [docs, total] = await Promise.all([
    RegistrationModel.find(filter)
      .sort(sort)
      .skip((page - 1) * pageSize)
      .limit(pageSize),
    RegistrationModel.countDocuments(filter),
  ]);

  const items = await Promise.all(
    docs.map(async (doc) => {
      const user = await findUserById(doc.userId);
      return toRegistrationRecord(doc, user);
    }),
  );

  return { items, total, page, pageSize };
}

export async function getRegistrationById(
  id: string,
): Promise<RegistrationRecord | null> {
  await connectDb();
  const doc = await RegistrationModel.findById(id);
  if (!doc) return null;
  const user = await findUserById(doc.userId);
  return toRegistrationRecord(doc, user);
}

export async function countRegistrations(
  filter: {
    eventSlug?: string;
    paymentStatus?: RegistrationRecord["paymentStatus"];
    ticketStatus?: RegistrationRecord["ticketStatus"];
  } = {},
): Promise<number> {
  await connectDb();
  return RegistrationModel.countDocuments(filter);
}

export async function sumRevenueUsd(eventSlug?: string): Promise<number> {
  await connectDb();
  const match: Record<string, unknown> = { paymentStatus: "paid" };
  if (eventSlug) match.eventSlug = eventSlug;
  const result = await RegistrationModel.aggregate<{ total: number }>([
    { $match: match },
    { $group: { _id: null, total: { $sum: "$amountPaidUsd" } } },
  ]);
  return result[0]?.total ?? 0;
}
