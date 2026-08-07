import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/app/admin-145678/AdminShell";
import { ADMIN_BASE_PATH, ADMIN_LOGIN_PATH } from "@/constants/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect(`${ADMIN_LOGIN_PATH}?callbackUrl=${encodeURIComponent(ADMIN_BASE_PATH)}`);
  }
  if (!session.user.isAdmin) redirect("/");

  return <AdminShell email={session.user.email ?? "admin"}>{children}</AdminShell>;
}
