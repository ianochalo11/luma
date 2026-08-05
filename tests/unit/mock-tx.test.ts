import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  mockConnectWallet,
  mockPayWithWallet,
  shortenAddress,
} from "@/lib/solana/mock-tx";

describe("mock solana payment", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shortens wallet addresses", () => {
    expect(shortenAddress("7Yk5EaTtDVqiL1YgBQLxUP72XfjnL3DehyzQsCkvmUZE")).toBe(
      "7Yk5…mUZE",
    );
  });

  it("connect → pay happy path", async () => {
    const connectPromise = mockConnectWallet();
    await vi.runAllTimersAsync();
    const address = await connectPromise;
    expect(address.length).toBeGreaterThan(20);

    const payPromise = mockPayWithWallet(550);
    await vi.runAllTimersAsync();
    const result = await payPromise;
    expect(result.status).toBe("success");
    expect(result.signature.startsWith("mock")).toBe(true);
  });

  it("rejects zero amount", async () => {
    const payPromise = mockPayWithWallet(0);
    await vi.runAllTimersAsync();
    const result = await payPromise;
    expect(result.status).toBe("error");
  });
});
