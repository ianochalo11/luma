import { Schema, models, model, type InferSchemaType, type Model } from "mongoose";

const FollowSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    eventId: { type: String, default: null, index: true },
    organizerId: { type: String, default: null, index: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

FollowSchema.index(
  { userId: 1, eventId: 1 },
  {
    unique: true,
    partialFilterExpression: { eventId: { $type: "string" } },
  },
);

FollowSchema.index(
  { userId: 1, organizerId: 1 },
  {
    unique: true,
    partialFilterExpression: { organizerId: { $type: "string" } },
  },
);

export type FollowDocument = InferSchemaType<typeof FollowSchema> & {
  _id: Schema.Types.ObjectId;
  createdAt: Date;
};

export const FollowModel: Model<FollowDocument> =
  (models.Follow as Model<FollowDocument>) ||
  model<FollowDocument>("Follow", FollowSchema);
