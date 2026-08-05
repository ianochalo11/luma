import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const EventSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    organizerId: { type: String, required: true, index: true },
    organizerName: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    timezone: { type: String, default: "UTC" },
    location: {
      name: String,
      cityLine: String,
      fullAddress: String,
      latitude: Number,
      longitude: Number,
    },
    priceUsd: { type: Number, required: true, default: 0 },
    currencyLabel: { type: String, default: "USD" },
    capacity: { type: Number, default: null },
    coverUrl: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export type EventDocument = InferSchemaType<typeof EventSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

export const EventModel: Model<EventDocument> =
  (models.Event as Model<EventDocument>) || model<EventDocument>("Event", EventSchema);
