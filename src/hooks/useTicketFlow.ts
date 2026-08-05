import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RegistrationSchema } from "@/lib/validation/registrationSchema";

export type TxStatus = "idle" | "connecting" | "confirming" | "success" | "error";

interface TicketFlowState {
  registration: Partial<RegistrationSchema> | null;
  accessCode: string;
  discountUsd: number;
  walletAddress: string | null;
  txStatus: TxStatus;
  txError: string | null;
  setRegistration: (data: RegistrationSchema) => void;
  patchRegistration: (data: Partial<RegistrationSchema>) => void;
  setAccessCode: (code: string) => void;
  applyAccessCode: (code: string) => boolean;
  setWalletAddress: (address: string | null) => void;
  setTxStatus: (status: TxStatus, error?: string | null) => void;
  resetPayment: () => void;
  clear: () => void;
}

/** Demo access code — 10% off for UX testing */
const VALID_CODES: Record<string, number> = {
  SOLANA10: 55,
  BREAKPOINT: 50,
};

export const useTicketFlow = create<TicketFlowState>()(
  persist(
    (set) => ({
      registration: null,
      accessCode: "",
      discountUsd: 0,
      walletAddress: null,
      txStatus: "idle",
      txError: null,
      setRegistration: (data) => set({ registration: data }),
      patchRegistration: (data) =>
        set((state) => ({
          registration: { ...state.registration, ...data },
        })),
      setAccessCode: (code) => set({ accessCode: code }),
      applyAccessCode: (code) => {
        const normalized = code.trim().toUpperCase();
        const discount = VALID_CODES[normalized] ?? 0;
        set({ accessCode: normalized, discountUsd: discount });
        return discount > 0;
      },
      setWalletAddress: (address) => set({ walletAddress: address }),
      setTxStatus: (status, error = null) => set({ txStatus: status, txError: error }),
      resetPayment: () => set({ txStatus: "idle", txError: null, walletAddress: null }),
      clear: () =>
        set({
          registration: null,
          accessCode: "",
          discountUsd: 0,
          walletAddress: null,
          txStatus: "idle",
          txError: null,
        }),
    }),
    {
      name: "breakpoint-ticket-flow",
      partialize: (state) => ({
        registration: state.registration,
        accessCode: state.accessCode,
        discountUsd: state.discountUsd,
      }),
    },
  ),
);
