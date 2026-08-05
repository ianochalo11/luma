import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/app/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=/admin");
  if (!session.user.isAdmin) redirect("/");

  return <AdminShell email={session.user.email ?? "admin"}>{children}</AdminShell>;
}
