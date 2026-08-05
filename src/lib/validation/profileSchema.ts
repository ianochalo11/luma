import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().email("Enter a valid email"),
  walletAddress: z.string().trim().optional(),
  notificationPreferences: z.object({
    eventReminders: z.boolean(),
    marketing: z.boolean(),
    ticketUpdates: z.boolean(),
  }),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
