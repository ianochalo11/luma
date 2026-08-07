"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, Pencil, Wallet } from "lucide-react";
import { PAYMENT_COPY, REGISTRATION_COPY } from "@/constants/event-content";
import { COUNTRIES } from "@/constants/countries";
import { useTicketFlow } from "@/hooks/useTicketFlow";
import { useAppSession } from "@/hooks/useSession";
import {
  registrationSchema,
  type RegistrationSchema,
} from "@/lib/validation/registrationSchema";
import { UserAvatar } from "@/components/account/UserAvatar";
import { UpdateNameModal } from "@/components/registration/UpdateNameModal";
import { ComingSoonDialog } from "@/components/registration/ComingSoonDialog";
import {
  agreementCheckboxClass,
  agreementLabelClass,
  fieldControlClass,
  fieldHelperClass,
  fieldLabelClass,
  fieldSelectClass,
  registrationFaintClass,
  registrationHeadingClass,
  registrationMutedClass,
} from "@/components/registration/fieldStyles";
import { cn } from "@/lib/utils/cn";

const fields = REGISTRATION_COPY.fields;
const agreements = REGISTRATION_COPY.agreements;

export function RegistrationForm() {
  const { user, status } = useAppSession();
  const signedIn = status === "authenticated" && !!user;
  const sessionName = user?.name ?? "";
  const sessionEmail = user?.email ?? "";
  const sessionImage = user?.image ?? null;
  const sessionFirstName = user?.firstName ?? "Guest";
  const saved = useTicketFlow((s) => s.registration);
  const setRegistration = useTicketFlow((s) => s.setRegistration);

  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
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

  const country = watch("country");
  const ecosystemTenure = watch("ecosystemTenure");
  const tshirtSize = watch("tshirtSize");

  useEffect(() => {
    if (!signedIn) return;
    setValue("name", sessionName, { shouldValidate: true });
    setValue("email", sessionEmail, { shouldValidate: true });
  }, [signedIn, sessionName, sessionEmail, setValue]);

  useEffect(() => {
    if (!saved) return;
    reset({
      ...saved,
      name: signedIn ? sessionName : saved.name,
      email: signedIn ? sessionEmail : saved.email,
    });
  }, [saved, reset, signedIn, sessionName, sessionEmail]);

  const onSubmit = handleSubmit((data) => {
    setRegistration(data);
    // Payment API not wired yet — validate only, then Coming Soon.
    setComingSoonOpen(true);
  });

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5" noValidate>
        <section className="space-y-4">
          <h3 className={registrationHeadingClass}>
            {REGISTRATION_COPY.yourInfoHeading}
          </h3>

          {signedIn ? (
            <>
              <input type="hidden" {...register("name")} />
              <input type="hidden" {...register("email")} />
              <button
                type="button"
                onClick={() => setNameModalOpen(true)}
                aria-label="Edit name"
                className="focus-visible:ring-[#171717]/ring-offset-2 flex w-full items-center gap-3 rounded-xl text-left transition-colors hover:bg-[#F9FAFB] focus-visible:ring-2 focus-visible:outline-none"
              >
                <UserAvatar name={sessionName} image={sessionImage} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold text-[#171717]">
                      {sessionFirstName}
                    </p>
                    <Pencil
                      className={cn("h-3.5 w-3.5 shrink-0", registrationMutedClass)}
                      strokeWidth={1.75}
                      aria-hidden
                    />
                  </div>
                  <p className={cn(registrationMutedClass, "truncate text-sm")}>
                    {sessionEmail}
                  </p>
                </div>
              </button>
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
                  className={fieldControlClass(!!errors.name)}
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
                  className={fieldControlClass(!!errors.email)}
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
              className={fieldControlClass(!!errors.legalName)}
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
              className={fieldControlClass(!!errors.company)}
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
              className={fieldControlClass(!!errors.jobTitle)}
              autoComplete="organization-title"
            />
          </Field>

          <Field
            id="country"
            label={fields.country.label}
            required
            error={errors.country?.message}
          >
            <div className="relative">
              <select
                id="country"
                {...register("country")}
                className={cn(
                  fieldSelectClass(!!errors.country),
                  !country && registrationFaintClass,
                )}
              >
                <option value="">Select a country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </Field>

          <Field id="city" label={fields.city.label} error={errors.city?.message}>
            <input
              id="city"
              {...register("city")}
              className={fieldControlClass(!!errors.city)}
              autoComplete="address-level2"
            />
          </Field>

          <Field id="github" label={fields.github.label} error={errors.github?.message}>
            <input
              id="github"
              {...register("github")}
              className={fieldControlClass(!!errors.github)}
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
            <div className="relative">
              <select
                id="ecosystemTenure"
                {...register("ecosystemTenure")}
                className={cn(
                  fieldSelectClass(!!errors.ecosystemTenure),
                  !ecosystemTenure && registrationFaintClass,
                )}
              >
                <option value="">Select an option</option>
                {fields.ecosystemTenure.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
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
            <div className="relative">
              <select
                id="tshirtSize"
                {...register("tshirtSize")}
                className={cn(
                  fieldSelectClass(!!errors.tshirtSize),
                  !tshirtSize && registrationFaintClass,
                )}
              >
                <option value="">Select an option</option>
                {fields.tshirtSize.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <SelectChevron />
            </div>
          </Field>
        </section>

        <div className="space-y-3 pt-1">
          <Agreement {...register("agreeTerms")} error={errors.agreeTerms?.message}>
            I agree to the Terms and Conditions of the event:{" "}
            <a
              href={agreements.terms.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#6B7280] underline-offset-2 hover:underline"
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
              className="font-medium text-[#6B7280] underline-offset-2 hover:underline"
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

        <section className="space-y-3 border-t border-[#E5E7EB] pt-5">
          <h3 className={registrationHeadingClass}>{PAYMENT_COPY.heading}</h3>

          <div
            className="text-md flex h-[38px] items-center gap-2.5 rounded-[8px] bg-[#F3F4F6] px-3.5 font-medium text-[#171717]"
            aria-label={`${PAYMENT_COPY.methodLabel}: ${PAYMENT_COPY.methodValue}`}
          >
            <UsdcIcon />
            {PAYMENT_COPY.methodValue}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#171717] text-sm font-semibold text-white transition-[transform,opacity] hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
          >
            <Wallet className="h-4 w-4" strokeWidth={2} aria-hidden />
            {PAYMENT_COPY.payWithWallet}
          </button>
        </section>
      </form>

      {signedIn ? (
        <UpdateNameModal
          open={nameModalOpen}
          initialName={sessionName}
          onClose={() => setNameModalOpen(false)}
          onUpdated={(next) => {
            setValue("name", next, { shouldValidate: true });
          }}
        />
      ) : null}

      <ComingSoonDialog open={comingSoonOpen} onClose={() => setComingSoonOpen(false)} />
    </>
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
      <label htmlFor={id} className={fieldLabelClass}>
        {label}
        {helper ? <span className={fieldHelperClass}> - {helper}</span> : null}
        {required ? <RequiredMark /> : null}
      </label>
      {children}
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
      <label className={agreementLabelClass}>
        <input type="checkbox" className={agreementCheckboxClass} {...props} />
        <span>
          {children}
          <RequiredMark />
        </span>
      </label>
      {error ? (
        <p className="mt-1 pl-7 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectChevron() {
  return (
    <ChevronDown
      className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#6B7280]"
      aria-hidden
    />
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
          fieldControlClass(!!invalid),
          "flex items-center justify-between gap-2 pr-9 text-left",
          value.length === 0 && "text-[#9CA3AF]",
        )}
      >
        <span className="truncate">{label}</span>
        <ChevronDown
          className={cn(
            "absolute top-1/2 right-3 h-4 w-4 shrink-0 -translate-y-1/2 text-[#6B7280] transition-transform",
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
          className="absolute right-0 left-0 z-30 mt-1.5 max-h-56 overflow-y-auto rounded-[8px] border border-[#E5E7EB] bg-white py-1 shadow-lg"
        >
          {options.map((opt) => {
            const selected = value.includes(opt);
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm text-[#171717] transition-colors",
                    selected ? "bg-[#F3F4F6]" : "hover:bg-[#F9FAFB]",
                  )}
                  onClick={() => {
                    onChange(selected ? value.filter((v) => v !== opt) : [...value, opt]);
                  }}
                >
                  {opt}
                  {selected ? (
                    <Check className="h-4 w-4 shrink-0 text-[#171717]" aria-hidden />
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
