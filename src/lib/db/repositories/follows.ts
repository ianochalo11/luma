import { connectDb } from "@/lib/db/client";
import { FollowModel } from "@/lib/db/models";

export async function getFollowStatus(params: {
  userId: string;
  eventId?: string;
  organizerId?: string;
}): Promise<boolean> {
  await connectDb();
  const or: Record<string, string>[] = [];
  if (params.eventId) or.push({ eventId: params.eventId });
  if (params.organizerId) or.push({ organizerId: params.organizerId });
  if (or.length === 0) return false;

  const existing = await FollowModel.findOne({
    userId: params.userId,
    $or: or,
  });
  return Boolean(existing);
}

export async function setFollow(params: {
  userId: string;
  eventId?: string;
  organizerId?: string;
  following: boolean;
}): Promise<{ following: boolean }> {
  await connectDb();
  const { userId, eventId, organizerId, following } = params;

  if (!eventId && !organizerId) {
    throw new Error("eventId or organizerId is required");
  }

  if (!following) {
    const filter: Record<string, unknown> = { userId };
    if (eventId && organizerId) {
      filter.$or = [{ eventId }, { organizerId }];
    } else if (eventId) {
      filter.eventId = eventId;
    } else {
      filter.organizerId = organizerId;
    }
    await FollowModel.deleteMany(filter);
    return { following: false };
  }

  const existing = await FollowModel.findOne({
    userId,
    ...(eventId ? { eventId } : { organizerId }),
  });

  if (!existing) {
    await FollowModel.create({
      userId,
      eventId: eventId ?? null,
      organizerId: organizerId ?? null,
    });
  } else {
    if (eventId && !existing.eventId) existing.eventId = eventId;
    if (organizerId && !existing.organizerId) {
      existing.organizerId = organizerId;
    }
    await existing.save();
  }

  return { following: true };
}

export async function countFollowers(params: {
  eventId?: string;
  organizerId?: string;
}): Promise<number> {
  await connectDb();
  const or: Record<string, string>[] = [];
  if (params.eventId) or.push({ eventId: params.eventId });
  if (params.organizerId) or.push({ organizerId: params.organizerId });
  if (or.length === 0) return 0;
  return FollowModel.countDocuments({ $or: or });
}

/** Returns userIds that follow the given event. */
export async function listFollowerUserIds(
  userIds: string[],
  eventId: string,
): Promise<Set<string>> {
  await connectDb();
  if (userIds.length === 0) return new Set();
  const docs = await FollowModel.find({
    userId: { $in: userIds },
    eventId,
  }).select("userId");
  return new Set(docs.map((d) => d.userId));
}
