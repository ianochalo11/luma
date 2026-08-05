/**
 * Mock Solana payment helpers.
 * Phase 3 ships a simulated USDC transfer lifecycle.
 * Swap `mockPayWithWallet` for a real `@solana/web3.js` + wallet-adapter
 * transaction when connecting a real RPC / treasury.
 */

export type MockTxPhase = "idle" | "connecting" | "confirming" | "success" | "error";

const DEMO_WALLETS = [
  "7Yk5EaTtDVqiL1YgBQLxUP72XfjnL3DehyzQsCkvmUZE",
  "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
  "5SBcXhdfhz9om7AYyNhb1GBnK8dK6oCa9VrcqgnPfJw1",
] as const;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}

export async function mockConnectWallet(): Promise<string> {
  await delay(900);
  const index = Math.floor(Math.random() * DEMO_WALLETS.length);
  return DEMO_WALLETS[index] ?? DEMO_WALLETS[0];
}

export async function mockCheckUsdcBalance(address: string): Promise<number> {
  void address;
  await delay(500);
  // Always enough for the demo ticket
  return 1_250.55;
}

export interface MockPayResult {
  signature: string;
  status: "success" | "error";
  error?: string;
}

export async function mockPayWithWallet(amountUsd: number): Promise<MockPayResult> {
  await delay(1400);
  // Deterministic demo: fail only if amount is somehow zero
  if (amountUsd <= 0) {
    return {
      signature: "",
      status: "error",
      error: "Invalid payment amount",
    };
  }
  const signature = `mock${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
  return { signature, status: "success" };
}
