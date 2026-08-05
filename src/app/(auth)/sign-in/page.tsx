import { Suspense } from "react";
import { SignInForm } from "@/components/auth/SignInForm";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="bg-brand-20 h-64 animate-pulse rounded-xl" />}>
      <SignInForm />
    </Suspense>
  );
}
