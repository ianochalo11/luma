import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

/** Auth.js WebAuthn / passkey credential for a user. */
const AuthenticatorSchema = new Schema(
  {
    credentialID: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    providerAccountId: { type: String, required: true },
    credentialPublicKey: { type: String, required: true },
    counter: { type: Number, required: true },
    credentialDeviceType: { type: String, required: true },
    credentialBackedUp: { type: Boolean, required: true },
    transports: { type: String, default: null },
  },
  { timestamps: false },
);

AuthenticatorSchema.index({ userId: 1, credentialID: 1 }, { unique: true });

export type AuthenticatorDocument = InferSchemaType<typeof AuthenticatorSchema> & {
  _id: Schema.Types.ObjectId;
};

export const AuthenticatorModel: Model<AuthenticatorDocument> =
  (models.Authenticator as Model<AuthenticatorDocument>) ||
  model<AuthenticatorDocument>("Authenticator", AuthenticatorSchema);
