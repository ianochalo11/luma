"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SignInModal } from "@/components/auth/SignInModal";

type PendingAction = (() => void | Promise<void>) | null;

interface SignInModalContextValue {
  open: boolean;
  openSignIn: (opts?: { onSuccess?: () => void | Promise<void> }) => void;
  closeSignIn: () => void;
}

const SignInModalContext = createContext<SignInModalContextValue | null>(null);

export function SignInModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pendingRef = useRef<PendingAction>(null);
  const { update } = useSession();
  const router = useRouter();

  const openSignIn = useCallback((opts?: { onSuccess?: () => void | Promise<void> }) => {
    pendingRef.current = opts?.onSuccess ?? null;
    setOpen(true);
  }, []);

  const closeSignIn = useCallback(() => {
    pendingRef.current = null;
    setOpen(false);
  }, []);

  const handleSuccess = useCallback(async () => {
    const action = pendingRef.current;
    pendingRef.current = null;
    setOpen(false);
    await update();
    router.refresh();
    if (action) await action();
  }, [update, router]);

  const value = useMemo(
    () => ({ open, openSignIn, closeSignIn }),
    [open, openSignIn, closeSignIn],
  );

  return (
    <SignInModalContext.Provider value={value}>
      {children}
      <SignInModal open={open} onClose={closeSignIn} onSuccess={handleSuccess} />
    </SignInModalContext.Provider>
  );
}

export function useSignInModal() {
  const ctx = useContext(SignInModalContext);
  if (!ctx) {
    throw new Error("useSignInModal must be used within SignInModalProvider");
  }
  return ctx;
}
