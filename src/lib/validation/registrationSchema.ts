import { z } from "zod";
import { REGISTRATION_COPY } from "@/constants/event-content";

const tenureValues = [...REGISTRATION_COPY.fields.ecosystemTenure.options] as [
  string,
  ...string[],
];
const categoryValues = [...REGISTRATION_COPY.fields.categories.options] as [
  string,
  ...string[],
];
const tshirtValues = [...REGISTRATION_COPY.fields.tshirtSize.options] as [
  string,
  ...string[],
];

export const registrationSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  legalName: z.string().trim().min(1, "Legal name is required"),
  company: z.string().trim().min(1, "Company is required"),
  jobTitle: z.string().trim().optional(),
  country: z.string().trim().min(1, "Country is required"),
  city: z.string().trim().optional(),
  github: z.string().trim().optional(),
  ecosystemTenure: z
    .string()
    .min(1, "Please select how long you’ve been in the ecosystem")
    .refine((v) => (tenureValues as string[]).includes(v), {
      message: "Invalid selection",
    }),
  categories: z
    .array(z.string())
    .min(1, "Select at least one category")
    .refine((arr) => arr.every((v) => (categoryValues as string[]).includes(v)), {
      message: "Invalid category",
    }),
  tshirtSize: z
    .string()
    .optional()
    .transform((v) => (v === "" || v === undefined ? undefined : v))
    .refine((v) => v === undefined || (tshirtValues as string[]).includes(v), {
      message: "Invalid size",
    }),
  agreeTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Terms and Conditions",
  }),
  agreeCodeOfConduct: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Code of Conduct",
  }),
  agreeNonRefundable: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge the non-refundable ticket policy",
  }),
});

export type RegistrationSchema = z.infer<typeof registrationSchema>;
