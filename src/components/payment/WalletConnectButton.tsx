"use client";

import { useWallet } from "@/hooks/useWallet";

export function WalletConnectButton({
  onConnected,
}: {
  onConnected?: (address: string) => void;
}) {
  const { address, status, connect, disconnect, shortAddress } = useWallet();

  if (address) {
    return (
      <div className="flex items-center gap-2">
        <span className="bg-brand-10 text-brand-70 rounded-full px-3 py-1.5 font-mono text-xs">
          {shortAddress}
        </span>
        <button
          type="button"
          onClick={() => void disconnect()}
          className="text-muted hover:text-foreground text-sm underline-offset-2 hover:underline"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      disabled={status === "connecting"}
      onClick={() => {
        void connect().then((addr) => {
          if (addr) onConnected?.(addr);
        });
      }}
      className="bg-brand-50 hover:bg-brand-60 inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium text-white shadow-sm transition-[transform,background-color] duration-200 ease-out active:scale-[0.98] disabled:opacity-60"
    >
      {status === "connecting" ? "Connecting wallet…" : "Pay with Wallet"}
    </button>
  );
}
