"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { LINKS } from "@/constants/links";
import { Button } from "@/components/ui/Button";

export function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setPending(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: LINKS.site.profile,
    });
    setPending(false);
    if (result?.error) {
      setError("Could not create account");
      return;
    }
    router.push(LINKS.site.profile);
    router.refresh();
  }

  return (
    <div className="border-border bg-surface rounded-xl border p-8 shadow-sm">
      <h1 className="font-title text-2xl font-semibold tracking-tight">Create account</h1>
      <p className="text-muted mt-2 text-sm">
        Creates a MongoDB user and JWT session. Prefer email OTP on Sign in for the
        production-style flow.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-border focus-visible:border-brand-50 mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="signup-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-border focus-visible:border-brand-50 mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none"
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="signup-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-border focus-visible:border-brand-50 mt-1.5 h-11 w-full rounded-lg border px-3 text-sm outline-none"
            autoComplete="new-password"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Creating…" : "Create account"}
        </Button>
      </form>

      <p className="text-muted mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href={LINKS.site.signIn}
          className="text-brand-60 font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
