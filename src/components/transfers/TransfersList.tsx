"use client";

import { useCallback, useEffect, useState } from "react";
import { TransferCard } from "./TransferCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import type { OutgoingTransfer } from "@/lib/mono/types";

export function TransfersList({ refreshKey }: { refreshKey: number }) {
  const [transfers, setTransfers] = useState<OutgoingTransfer[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/transfers");
      if (!response.ok) throw new Error("No se pudieron cargar las transferencias");
      const data = (await response.json()) as { transfers: OutgoingTransfer[] };
      setTransfers(data.transfers);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  if (isLoading) return <p className="text-sm text-ink/60">Cargando transferencias...</p>;
  if (error) return <ErrorState message={error} />;
  if (transfers.length === 0) return <EmptyState message="Aún no hay transferencias." />;

  return (
    <div className="flex flex-col gap-3">
      {transfers.map((transfer) => (
        <TransferCard key={transfer.id} transfer={transfer} />
      ))}
    </div>
  );
}
