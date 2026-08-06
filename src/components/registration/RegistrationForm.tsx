"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Pencil, Wallet } from "lucide-react";
import {
  BREAKPOINT_EVENT,
  PAYMENT_COPY,
  REGISTRATION_COPY,
} from "@/constants/event-content";
import { COUNTRIES } from "@/constants/countries";
import { useTicketFlow } from "@/hooks/useTicketFlow";
import { useAppSession } from "@/hooks/useSession";
import { useWallet } from "@/hooks/useWallet";
import { mockPayWithWallet } from "@/lib/solana/mock-tx";
import {
  registrationSchema,
  type RegistrationSchema,
} from "@/lib/validation/registrationSchema";
import { UserAvatar } from "@/components/account/UserAvatar";
import { UpdateNameModal } from "@/components/registration/UpdateNameModal";
import { TransactionStatus } from "@/components/payment/TransactionStatus";
import { cn } from "@/lib/utils/cn";

const fields = REGISTRATION_COPY.fields;
const agreements = REGISTRATION_COPY.agreements;

interface RegistrationFormProps {
  onPaid?: () => void;
}

export function RegistrationForm({ onPaid }: RegistrationFormProps) {
  const { user, status } = useAppSession();
  const signedIn = status === "authenticated" && !!user;
  const saved = useTicketFlow((s) => s.registration);
  const setRegistration = useTicketFlow((s) => s.setRegistration);
  const discountUsd = useTicketFlow((s) => s.discountUsd);
  const accessCode = useTicketFlow((s) => s.accessCode);
  const txStatus = useTicketFlow((s) => s.txStatus);
  const txError = useTicketFlow((s) => s.txError);
  const setTxStatus = useTicketFlow((s) => s.setTxStatus);
  const resetPayment = useTicketFlow((s) => s.resetPayment);
  const setWalletAddress = useTicketFlow((s) => s.setWalletAddress);

  const { address, connect, shortAddress, disconnect } = useWallet();
  const [signature, setSignature] = useState<string | null>(null);
  const [nameModalOpen, setNameModalOpen] = useState(false);

  const total = useMemo(
    () => Math.max(BREAKPOINT_EVENT.ticket.priceUsd - discountUsd, 0),
    [discountUsd],
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      email: "",
      legalName: "",
      company: "",
      jobTitle: "",
      country: "",
      city: "",
      github: "",
      ecosystemTenure: "",
      categories: [],
      tshirtSize: "",
      agreeTerms: false,
      agreeCodeOfConduct: false,
      agreeNonRefundable: false,
      ...saved,
    },
  });

  useEffect(() => {
    if (signedIn && user) {
      setValue("name", user.name, { shouldValidate: true });
      setValue("email", user.email, { shouldValidate: true });
    }
  }, [signedIn, user, setValue]);

  useEffect(() => {
    if (!saved) return;
    reset({
      ...saved,
      name: signedIn && user ? user.name : saved.name,
      email: signedIn && user ? user.email : saved.email,
    });
  }, [saved, reset, signedIn, user]);

  async function pay(data: RegistrationSchema) {
    setRegistration(data);
    setSignature(null);

    let wallet = address;
    if (!wallet) {
      setTxStatus("connecting");
      wallet = await connect();
      if (!wallet) {
        setTxStatus("error", "Connect a wallet to pay");
        return;
      }
      setWalletAddress(wallet);
    }

    setTxStatus("confirming");
    const result = await mockPayWithWallet(total);
    if (result.status === "success") {
      setSignature(result.signature);
      try {
        await fetch("/api/registrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            form: data,
            ticketPriceUsd: BREAKPOINT_EVENT.ticket.priceUsd,
            discountUsd,
            amountPaidUsd: total,
            accessCode: accessCode || null,
            paymentSignature: result.signature,
            walletAddress: wallet,
            ticketStatus: "confirmed",
            paymentStatus: "paid",
          }),
        });
      } catch {
        /* payment succeeded; booking persist is best-effort */
      }
      setTxStatus("success");
    } else {
      setTxStatus("error", result.error ?? "Transaction failed");
    }
  }

  const onSubmit = handleSubmit((data) => void pay(data));

  if (txStatus === "success") {
    return (
      <div className="mx-auto max-w-md space-y-5 py-8 text-center">
        <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8">
          <p className="font-title text-foreground text-2xl font-semibold">
            You’re going to Breakpoint
          </p>
          <p className="text-muted mt-2 text-sm">
            Ticket for {saved?.legalName ?? saved?.name} · {BREAKPOINT_EVENT.title}
          </p>
          {signature && (
            <p className="text-faint mt-4 font-mono text-xs break-all">
              Receipt: {signature}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            resetPayment();
            onPaid?.();
          }}
          className="bg-brand-50 hover:bg-brand-60 inline-flex h-11 w-full items-center justify-center rounded-xl text-sm font-semibold text-white"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <section className="space-y-4">
        <h3 className="font-title text-foreground text-[22px] font-semibold tracking-tight">
          {REGISTRATION_COPY.yourInfoHeading}
        </h3>

        {signedIn && user ? (
          <>
            <input type="hidden" {...register("name")} />
            <input type="hidden" {...register("email")} />
            <div className="flex items-center gap-3">
              <UserAvatar name={user.name} image={user.image} size="sm" />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {user.firstName}
                  </p>
                  <button
                    type="button"
                    aria-label="Edit name"
                    onClick={() => setNameModalOpen(true)}
                    className="text-muted hover:text-foreground inline-flex shrink-0 bg-transparent p-0 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
                  </button>
                </div>
                <p className="text-muted truncate text-sm">{user.email}</p>
              </div>
            </div>

            <UpdateNameModal
              open={nameModalOpen}
              initialName={user.name}
              onClose={() => setNameModalOpen(false)}
              onUpdated={(next) => {
                setValue("name", next, { shouldValidate: true });
              }}
            />
          </>
        ) : (
          <>
            <Field
              id="name"
              label={fields.name.label}
              required
              error={errors.name?.message}
            >
              <input
                id="name"
                {...register("name")}
                className={inputClass(!!errors.name)}
                placeholder={fields.name.placeholder}
                autoComplete="name"
              />
            </Field>

            <Field
              id="email"
              label={fields.email.label}
              required
              error={errors.email?.message}
            >
              <input
                id="email"
                type="email"
                {...register("email")}
                className={inputClass(!!errors.email)}
                placeholder={fields.email.placeholder}
                autoComplete="email"
              />
            </Field>
          </>
        )}

        <Field
          id="legalName"
          label={fields.legalName.label}
          required
          helper={fields.legalName.helper}
          error={errors.legalName?.message}
        >
          <input
            id="legalName"
            {...register("legalName")}
            className={inputClass(!!errors.legalName)}
            autoComplete="name"
          />
        </Field>

        <Field
          id="company"
          label={fields.company.label}
          required
          helper={fields.company.helper}
          error={errors.company?.message}
        >
          <input
            id="company"
            {...register("company")}
            className={inputClass(!!errors.company)}
            autoComplete="organization"
          />
        </Field>

        <Field
          id="jobTitle"
          label={fields.jobTitle.label}
          error={errors.jobTitle?.message}
        >
          <input
            id="jobTitle"
            {...register("jobTitle")}
            className={inputClass(!!errors.jobTitle)}
            autoComplete="organization-title"
          />
        </Field>

        <Field
          id="country"
          label={fields.country.label}
          required
          error={errors.country?.message}
        >
          <select
            id="country"
            {...register("country")}
            className={inputClass(!!errors.country)}
          >
            <option value="">Select a country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field id="city" label={fields.city.label} error={errors.city?.message}>
          <input
            id="city"
            {...register("city")}
            className={inputClass(!!errors.city)}
            autoComplete="address-level2"
          />
        </Field>

        <Field id="github" label={fields.github.label} error={errors.github?.message}>
          <input
            id="github"
            {...register("github")}
            className={inputClass(!!errors.github)}
            autoComplete="username"
            placeholder="@username"
          />
        </Field>

        <Field
          id="ecosystemTenure"
          label={fields.ecosystemTenure.label}
          required
          error={errors.ecosystemTenure?.message}
        >
          <select
            id="ecosystemTenure"
            {...register("ecosystemTenure")}
            className={inputClass(!!errors.ecosystemTenure)}
          >
            <option value="">Select an option</option>
            {fields.ecosystemTenure.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>

        <Field
          id="categories"
          label={fields.categories.label}
          required
          error={errors.categories?.message}
        >
          <Controller
            control={control}
            name="categories"
            render={({ field }) => (
              <CategorySelect
                id="categories"
                options={[...fields.categories.options]}
                value={field.value ?? []}
                onChange={field.onChange}
                invalid={!!errors.categories}
                placeholder={fields.categories.helper}
              />
            )}
          />
        </Field>

        <Field
          id="tshirtSize"
          label={fields.tshirtSize.label}
          error={errors.tshirtSize?.message}
        >
          <select
            id="tshirtSize"
            {...register("tshirtSize")}
            className={inputClass(!!errors.tshirtSize)}
          >
            <option value="">Select an option</option>
            {fields.tshirtSize.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      </section>

      <div className="space-y-3 pt-1">
        <Agreement {...register("agreeTerms")} error={errors.agreeTerms?.message}>
          I agree to the Terms and Conditions of the event:{" "}
          <a
            href={agreements.terms.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-50 font-medium underline-offset-2 hover:underline"
          >
            {agreements.terms.href}
          </a>
        </Agreement>
        <Agreement
          {...register("agreeCodeOfConduct")}
          error={errors.agreeCodeOfConduct?.message}
        >
          I agree to abide by the Solana Foundation Code of Conduct:{" "}
          <a
            href={agreements.codeOfConduct.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-50 font-medium underline-offset-2 hover:underline"
          >
            {agreements.codeOfConduct.href}
          </a>
        </Agreement>
        <Agreement
          {...register("agreeNonRefundable")}
          error={errors.agreeNonRefundable?.message}
        >
          {agreements.nonRefundable.label}
        </Agreement>
      </div>

      <section className="border-border-subtle space-y-3 border-t pt-5">
        <h3 className="font-title text-foreground text-[22px] font-semibold tracking-tight">
          {PAYMENT_COPY.heading}
        </h3>

        <div
          className="bg-surface-muted text-foreground flex h-11 items-center gap-2.5 rounded-xl px-3.5 text-sm font-medium"
          aria-label={`${PAYMENT_COPY.methodLabel}: ${PAYMENT_COPY.methodValue}`}
        >
          <UsdcIcon />
          {PAYMENT_COPY.methodValue}
        </div>

        {txStatus !== "idle" && (
          <TransactionStatus status={txStatus} error={txError} signature={signature} />
        )}

        {address && (
          <div className="flex items-center justify-between gap-2 text-sm">
            <span className="bg-brand-10 text-brand-70 rounded-full px-3 py-1 font-mono text-xs">
              {shortAddress}
            </span>
            <button
              type="button"
              onClick={() => void disconnect()}
              className="text-muted hover:text-foreground underline-offset-2 hover:underline"
            >
              Disconnect
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={
            isSubmitting || txStatus === "confirming" || txStatus === "connecting"
          }
          className="bg-brand-50 hover:bg-brand-60 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-[transform,background-color] active:scale-[0.99] disabled:opacity-50"
        >
          <Wallet className="h-4 w-4" strokeWidth={2} aria-hidden />
          {txStatus === "connecting"
            ? "Connecting wallet…"
            : txStatus === "confirming"
              ? "Confirming…"
              : PAYMENT_COPY.payWithWallet}
        </button>
      </section>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  helper,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  helper?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-foreground-secondary block text-[13px] font-medium"
      >
        {label}
        {helper ? <span className="text-muted font-normal"> - {helper}</span> : null}
        {required ? <RequiredMark /> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function RequiredMark() {
  return (
    <span className="ml-0.5 text-red-500" aria-hidden>
      {" "}
      *
    </span>
  );
}

function Agreement({
  children,
  error,
  ...props
}: React.ComponentProps<"input"> & { error?: string }) {
  return (
    <div>
      <label className="text-foreground flex cursor-pointer items-start gap-2.5 text-[13px] leading-snug">
        <input
          type="checkbox"
          className="border-border mt-0.5 h-4 w-4 shrink-0 rounded accent-[var(--foreground)]"
          {...props}
        />
        <span>
          {children}
          <RequiredMark />
        </span>
      </label>
      {error ? (
        <p className="mt-1 pl-6 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function inputClass(invalid: boolean): string {
  return cn(
    "border-border bg-surface-muted text-foreground h-11 w-full rounded-xl border px-3.5 text-sm outline-none transition-colors",
    "placeholder:text-faint focus-visible:border-brand-40 focus-visible:bg-white",
    invalid && "border-red-400 focus-visible:border-red-400",
  );
}

function CategorySelect({
  id,
  options,
  value,
  onChange,
  invalid,
  placeholder,
}: {
  id: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  invalid?: boolean;
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const label =
    value.length === 0
      ? placeholder
      : value.length <= 2
        ? value.join(", ")
        : `${value.slice(0, 2).join(", ")} +${value.length - 2}`;

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          inputClass(!!invalid),
          "flex items-center justify-between gap-2 text-left",
          value.length === 0 && "text-faint",
        )}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            "text-muted h-4 w-4 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          className="border-border absolute right-0 left-0 z-30 mt-1.5 max-h-56 overflow-y-auto rounded-xl border bg-white py-1 shadow-lg"
        >
          {options.map((opt) => {
            const selected = value.includes(opt);
            return (
              <li key={opt} role="option" aria-selected={selected}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors",
                    selected
                      ? "bg-brand-5 text-brand-80"
                      : "text-foreground hover:bg-surface-muted",
                  )}
                  onClick={() => {
                    onChange(selected ? value.filter((v) => v !== opt) : [...value, opt]);
                  }}
                >
                  {opt}
                  {selected ? (
                    <Check className="text-brand-50 h-4 w-4 shrink-0" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function UsdcIcon() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2775CA] text-[9px] font-bold text-white"
      aria-hidden
    >
      $
    </span>
  );
}
