import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { usePolling } from "@/hooks/usePolling";

describe("usePolling", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("fetches immediately and stops once isTerminal returns true", async () => {
    const fetcher = vi.fn().mockResolvedValue({ state: "paid" });
    const { result } = renderHook(() =>
      usePolling({
        fetcher,
        isTerminal: (data: { state: string }) => data.state === "paid",
      }),
    );

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual({ state: "paid" });
    expect(result.current.isPolling).toBe(false);
  });

  it("polls again after intervalMs when not terminal, then stops", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce({ state: "created" })
      .mockResolvedValueOnce({ state: "paid" });

    const { result } = renderHook(() =>
      usePolling({
        fetcher,
        isTerminal: (data: { state: string }) => data.state === "paid",
        intervalMs: 1000,
      }),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.current.isPolling).toBe(true);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(result.current.data).toEqual({ state: "paid" });
    expect(result.current.isPolling).toBe(false);
  });

  it("stops polling and sets error when the fetcher rejects", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("network down"));
    const { result } = renderHook(() => usePolling({ fetcher, isTerminal: () => false }));

    await act(async () => {
      await vi.runAllTimersAsync();
    });

    expect(result.current.error?.message).toBe("network down");
    expect(result.current.isPolling).toBe(false);
  });
});
