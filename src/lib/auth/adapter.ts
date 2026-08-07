import type {
  Adapter,
  AdapterAccount,
  AdapterAuthenticator,
  AdapterUser,
} from "next-auth/adapters";
import { resolveAdminEmail } from "@/constants/admin";
import { connectDb } from "@/lib/db/client";
import {
  AccountModel,
  AuthenticatorModel,
  UserModel,
  type UserDocument,
} from "@/lib/db/models";

type AdapterUserWithAdmin = AdapterUser & { isAdmin?: boolean };

function displayNameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? "Guest";
  return local.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function toAdapterUser(doc: UserDocument): AdapterUserWithAdmin {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    image: doc.image ?? null,
    emailVerified: doc.emailVerified ?? null,
    isAdmin: Boolean(doc.isAdmin),
  };
}

function toAdapterAccount(doc: {
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}): AdapterAccount {
  return {
    userId: doc.userId,
    type: doc.type as AdapterAccount["type"],
    provider: doc.provider,
    providerAccountId: doc.providerAccountId,
    refresh_token: doc.refresh_token ?? undefined,
    access_token: doc.access_token ?? undefined,
    expires_at: doc.expires_at ?? undefined,
    token_type: (doc.token_type ?? undefined) as AdapterAccount["token_type"],
    scope: doc.scope ?? undefined,
    id_token: doc.id_token ?? undefined,
    session_state: doc.session_state ?? undefined,
  };
}

function toAdapterAuthenticator(doc: {
  credentialID: string;
  userId: string;
  providerAccountId: string;
  credentialPublicKey: string;
  counter: number;
  credentialDeviceType: string;
  credentialBackedUp: boolean;
  transports?: string | null;
}): AdapterAuthenticator {
  return {
    credentialID: doc.credentialID,
    userId: doc.userId,
    providerAccountId: doc.providerAccountId,
    credentialPublicKey: doc.credentialPublicKey,
    counter: doc.counter,
    credentialDeviceType: doc.credentialDeviceType,
    credentialBackedUp: doc.credentialBackedUp,
    transports: doc.transports ?? undefined,
  };
}

/**
 * Minimal Auth.js adapter for WebAuthn / Passkeys on top of our Mongoose User model.
 * JWT sessions stay in cookies; this persists users, linked accounts, and authenticators.
 */
export function MongoAuthAdapter(): Adapter {
  return {
    async createUser(data) {
      await connectDb();
      const email = String(data.email ?? "")
        .toLowerCase()
        .trim();
      if (!email) throw new Error("Cannot create user without email");

      const adminEmail = resolveAdminEmail();
      const created = await UserModel.create({
        email,
        name: data.name?.trim() || displayNameFromEmail(email),
        image: data.image ?? null,
        emailVerified: data.emailVerified ?? null,
        // Default; OAuth / OTP flows may set a more specific provider via upsert.
        authProvider: "email",
        isAdmin: Boolean(adminEmail && email === adminEmail),
      });
      return toAdapterUser(created);
    },

    async getUser(id) {
      await connectDb();
      const doc = await UserModel.findById(id);
      return doc ? toAdapterUser(doc) : null;
    },

    async getUserByEmail(email) {
      await connectDb();
      const doc = await UserModel.findOne({ email: email.toLowerCase().trim() });
      return doc ? toAdapterUser(doc) : null;
    },

    async getUserByAccount({ provider, providerAccountId }) {
      await connectDb();
      const account = await AccountModel.findOne({ provider, providerAccountId });
      if (!account) return null;
      const doc = await UserModel.findById(account.userId);
      return doc ? toAdapterUser(doc) : null;
    },

    async updateUser(data) {
      await connectDb();
      const doc = await UserModel.findById(data.id);
      if (!doc) throw new Error(`User not found: ${data.id}`);

      if (typeof data.name === "string") doc.name = data.name;
      if (typeof data.email === "string") doc.email = data.email.toLowerCase().trim();
      if (data.image !== undefined) doc.image = data.image;
      if (data.emailVerified !== undefined) doc.emailVerified = data.emailVerified;
      await doc.save();
      return toAdapterUser(doc);
    },

    async linkAccount(account) {
      await connectDb();
      const sessionState =
        account.session_state == null
          ? null
          : typeof account.session_state === "string"
            ? account.session_state
            : JSON.stringify(account.session_state);
      const created = await AccountModel.create({
        userId: account.userId,
        type: account.type,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token ?? null,
        access_token: account.access_token ?? null,
        expires_at: account.expires_at ?? null,
        token_type: account.token_type ?? null,
        scope: account.scope ?? null,
        id_token: account.id_token ?? null,
        session_state: sessionState,
      });
      return toAdapterAccount(created);
    },

    async getAccount(providerAccountId, provider) {
      await connectDb();
      const account = await AccountModel.findOne({ providerAccountId, provider });
      return account ? toAdapterAccount(account) : null;
    },

    async createAuthenticator(authenticator) {
      await connectDb();
      const created = await AuthenticatorModel.create({
        credentialID: authenticator.credentialID,
        userId: authenticator.userId,
        providerAccountId: authenticator.providerAccountId,
        credentialPublicKey: authenticator.credentialPublicKey,
        counter: authenticator.counter,
        credentialDeviceType: authenticator.credentialDeviceType,
        credentialBackedUp: authenticator.credentialBackedUp,
        transports: authenticator.transports ?? null,
      });
      return toAdapterAuthenticator(created);
    },

    async getAuthenticator(credentialID) {
      await connectDb();
      const doc = await AuthenticatorModel.findOne({ credentialID });
      return doc ? toAdapterAuthenticator(doc) : null;
    },

    async listAuthenticatorsByUserId(userId) {
      await connectDb();
      const docs = await AuthenticatorModel.find({ userId });
      return docs.map(toAdapterAuthenticator);
    },

    async updateAuthenticatorCounter(credentialID, newCounter) {
      await connectDb();
      const doc = await AuthenticatorModel.findOneAndUpdate(
        { credentialID },
        { $set: { counter: newCounter } },
        { new: true },
      );
      if (!doc) throw new Error(`Authenticator not found: ${credentialID}`);
      return toAdapterAuthenticator(doc);
    },
  };
}
