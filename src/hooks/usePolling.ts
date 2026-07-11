"use client";

import { useEffect, useRef, useState } from "react";

type UsePollingOptions<T> = {
  fetcher: () => Promise<T>;
  isTerminal: (data: T) => boolean;
  intervalMs?: number;
  timeoutMs?: number;
};

type UsePollingResult<T> = {
  data: T | null;
  error: Error | null;
  isPolling: boolean;
};

export function usePolling<T>({
  fetcher,
  isTerminal,
  intervalMs = 3000,
  timeoutMs = 60000,
}: UsePollingOptions<T>): UsePollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const fetcherRef = useRef(fetcher);
  const isTerminalRef = useRef(isTerminal);
  fetcherRef.current = fetcher;
  isTerminalRef.current = isTerminal;

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const startedAt = Date.now();

    async function tick() {
      try {
        const result = await fetcherRef.current();
        if (cancelled) return;
        setData(result);
        setError(null);

        if (isTerminalRef.current(result) || Date.now() - startedAt >= timeoutMs) {
          setIsPolling(false);
          return;
        }
        timeoutId = setTimeout(tick, intervalMs);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err : new Error("Polling failed"));
        setIsPolling(false);
      }
    }

    tick();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalMs, timeoutMs]);

  return { data, error, isPolling };
}
