import { connectDb } from "@/lib/db/client";
import { ensureBreakpointEvent } from "@/lib/db/repositories/events";
import { upsertUserOnSignIn } from "@/lib/db/repositories/users";
import { DEMO_USER } from "@/constants/event-content";

/** Idempotent seed for local/dev — event + demo admin user. */
export async function seedDatabase(): Promise<void> {
  await connectDb();
  await ensureBreakpointEvent();
  await upsertUserOnSignIn({
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    image: DEMO_USER.image,
    authProvider: "credentials",
  });
}
