import { Suspense } from "react";
import { AdminSignInForm } from "@/components/auth/AdminSignInForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <Suspense
          fallback={<div className="h-64 animate-pulse rounded-xl bg-neutral-100" />}
        >
          <AdminSignInForm />
        </Suspense>
      </div>
    </div>
  );
}
