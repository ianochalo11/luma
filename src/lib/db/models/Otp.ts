import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const otpSchema = new Schema(
  {
    email: { type: String, required: true, index: true },
    codeHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// TTL: Mongo removes docs when `expiresAt` is reached
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export type OtpDocument = InferSchemaType<typeof otpSchema> & {
  _id: Schema.Types.ObjectId;
};

export const OtpModel: Model<OtpDocument> =
  (models.Otp as Model<OtpDocument>) ?? model<OtpDocument>("Otp", otpSchema);
