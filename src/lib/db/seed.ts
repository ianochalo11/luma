import { connectDb } from "@/lib/db/client";
import { UserModel } from "@/lib/db/models";
import { ensureBreakpointEvent } from "@/lib/db/repositories/events";
import { upsertUserOnSignIn } from "@/lib/db/repositories/users";
import { DEMO_USER } from "@/constants/event-content";
import { resolveAdminEmail } from "@/constants/admin";

/** Idempotent seed for local/dev — event + demo user + admin flag sync. */
export async function seedDatabase(): Promise<void> {
  await connectDb();
  await ensureBreakpointEvent();
  await upsertUserOnSignIn({
    email: DEMO_USER.email,
    name: DEMO_USER.name,
    image: DEMO_USER.image,
    authProvider: "credentials",
  });

  const adminEmail = resolveAdminEmail();
  if (adminEmail) {
    await UserModel.updateMany(
      { email: { $ne: adminEmail }, isAdmin: true },
      { $set: { isAdmin: false } },
    );
    await upsertUserOnSignIn({
      email: adminEmail,
      authProvider: "email",
    });
  }
}
