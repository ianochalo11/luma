import type { RegistrationSchema } from "@/lib/validation/registrationSchema";

export type RegistrationFormValues = RegistrationSchema;

export type RegistrationStep = "form" | "payment" | "success";

export interface Registrant {
  userId: string;
  eventSlug: string;
  form: RegistrationFormValues;
  ticketPriceUsd: number;
  accessCode?: string;
  discountUsd?: number;
  createdAt: string;
}
