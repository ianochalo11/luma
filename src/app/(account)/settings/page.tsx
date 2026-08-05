import { SettingsForm } from "@/components/account/SettingsForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SettingsPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12">
        <SettingsForm />
      </main>
      <SiteFooter />
    </>
  );
}
