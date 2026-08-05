import { ProfileForm } from "@/components/account/ProfileForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function ProfilePage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <ProfileForm />
      </main>
      <SiteFooter />
    </>
  );
}
