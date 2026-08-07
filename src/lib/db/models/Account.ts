import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

/** Auth.js linked account (OAuth / WebAuthn / etc.). */
const AccountSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
    refresh_token: { type: String, default: null },
    access_token: { type: String, default: null },
    expires_at: { type: Number, default: null },
    token_type: { type: String, default: null },
    scope: { type: String, default: null },
    id_token: { type: String, default: null },
    session_state: { type: String, default: null },
  },
  { timestamps: false },
);

AccountSchema.index({ provider: 1, providerAccountId: 1 }, { unique: true });

export type AccountDocument = InferSchemaType<typeof AccountSchema> & {
  _id: Schema.Types.ObjectId;
};

export const AccountModel: Model<AccountDocument> =
  (models.Account as Model<AccountDocument>) ||
  model<AccountDocument>("Account", AccountSchema);
