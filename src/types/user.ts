export interface AppUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  authProvider?: "email" | "google" | "credentials" | "github";
  isAdmin?: boolean;
  walletAddress?: string | null;
  notificationPreferences?: NotificationPreferences;
}

export interface NotificationPreferences {
  eventReminders: boolean;
  marketing: boolean;
  ticketUpdates: boolean;
}

export interface UserTicket {
  eventSlug: string;
  eventTitle: string;
  status: "pending" | "confirmed" | "cancelled";
  purchasedAt?: string;
  displayPrice: string;
}
