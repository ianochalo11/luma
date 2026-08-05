import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const RegistrationSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    eventId: { type: String, required: true, index: true },
    eventSlug: { type: String, required: true, index: true },
    form: { type: Schema.Types.Mixed, required: true },
    ticketStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
      index: true,
    },
    ticketPriceUsd: { type: Number, required: true },
    discountUsd: { type: Number, default: 0 },
    amountPaidUsd: { type: Number, default: 0 },
    accessCode: { type: String, default: null },
    paymentSignature: { type: String, default: null },
    walletAddress: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

RegistrationSchema.index({ eventSlug: 1, createdAt: -1 });
RegistrationSchema.index({ userId: 1, eventId: 1 });

export type RegistrationDocument = InferSchemaType<typeof RegistrationSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const RegistrationModel: Model<RegistrationDocument> =
  (models.Registration as Model<RegistrationDocument>) ||
  model<RegistrationDocument>("Registration", RegistrationSchema);
