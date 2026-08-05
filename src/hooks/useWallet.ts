"use client";

import { useCallback, useState } from "react";
import {
  mockCheckUsdcBalance,
  mockConnectWallet,
  shortenAddress,
} from "@/lib/solana/mock-tx";
import { useTicketFlow } from "@/hooks/useTicketFlow";

type WalletStatus = "idle" | "connecting" | "connected" | "error";

export function useWallet() {
  const walletAddress = useTicketFlow((s) => s.walletAddress);
  const setWalletAddress = useTicketFlow((s) => s.setWalletAddress);
  const [status, setStatus] = useState<WalletStatus>(
    walletAddress ? "connected" : "idle",
  );
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setStatus("connecting");
    setError(null);
    try {
      const address = await mockConnectWallet();
      const bal = await mockCheckUsdcBalance(address);
      setWalletAddress(address);
      setBalance(bal);
      setStatus("connected");
      return address;
    } catch {
      setStatus("error");
      setError("Failed to connect wallet");
      return null;
    }
  }, [setWalletAddress]);

  const disconnect = useCallback(async () => {
    setWalletAddress(null);
    setBalance(null);
    setStatus("idle");
  }, [setWalletAddress]);

  return {
    address: walletAddress,
    shortAddress: walletAddress ? shortenAddress(walletAddress) : null,
    status,
    balance,
    error,
    connect,
    disconnect,
  };
}
