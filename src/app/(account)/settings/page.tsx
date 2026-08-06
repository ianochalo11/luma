import { SettingsForm } from "@/components/account/SettingsForm";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SettingsPage() {
  return (
    <div className="bg-background flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full flex-1 px-4 pt-10 pb-16 sm:px-6 sm:pt-14">
        <SettingsForm />
      </main>
      <SiteFooter />
    </div>
  );
}
