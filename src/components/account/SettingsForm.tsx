"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileSchema } from "@/lib/validation/profileSchema";
import { useAppSession } from "@/hooks/useSession";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";

export function SettingsForm() {
  const { user } = useAppSession();
  const [savedFlash, setSavedFlash] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      walletAddress: "",
      notificationPreferences: {
        eventReminders: true,
        marketing: false,
        ticketUpdates: true,
      },
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        walletAddress: "",
        notificationPreferences: {
          eventReminders: true,
          marketing: false,
          ticketUpdates: true,
        },
      });
    }
  }, [user, reset]);

  const onSubmit = handleSubmit(async () => {
    // Optimistic UI — no backend yet
    await new Promise((r) => setTimeout(r, 400));
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2000);
  });

  if (!user) return null;

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <h1 className="font-title text-2xl font-semibold">Settings</h1>
        <p className="text-muted mt-1 text-sm">Account details & preferences</p>
      </div>

      <div className="border-border bg-surface space-y-4 rounded-xl border p-5">
        <div>
          <label htmlFor="settings-name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="settings-name"
            {...register("name")}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="settings-email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="settings-email"
            type="email"
            {...register("email")}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="settings-wallet" className="text-sm font-medium">
            Connected wallet address
          </label>
          <input
            id="settings-wallet"
            {...register("walletAddress")}
            placeholder="Solana address"
            className={inputClass(false)}
          />
        </div>
      </div>

      <fieldset className="border-border bg-surface space-y-3 rounded-xl border p-5">
        <legend className="px-1 text-sm font-semibold">Notifications</legend>
        <Toggle
          label="Event reminders"
          {...register("notificationPreferences.eventReminders")}
        />
        <Toggle
          label="Ticket updates"
          {...register("notificationPreferences.ticketUpdates")}
        />
        <Toggle
          label="Marketing emails"
          {...register("notificationPreferences.marketing")}
        />
      </fieldset>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSubmitting || !isDirty}>
          {isSubmitting ? "Saving…" : "Save changes"}
        </Button>
        {savedFlash && (
          <p className="text-sm font-medium text-green-700" role="status">
            Saved
          </p>
        )}
      </div>
    </form>
  );
}

function Toggle({ label, ...props }: { label: string } & React.ComponentProps<"input">) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      <span>{label}</span>
      <input type="checkbox" className="h-4 w-4 accent-[var(--brand-50)]" {...props} />
    </label>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "mt-1.5 h-11 w-full rounded-lg border bg-surface px-3 text-sm outline-none focus-visible:border-brand-50",
    invalid ? "border-red-400" : "border-border",
  );
}
