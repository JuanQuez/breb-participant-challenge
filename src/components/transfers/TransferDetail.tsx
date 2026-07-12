"use client";

import Link from "next/link";
import { usePolling } from "@/hooks/usePolling";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { transferStatusTone } from "@/lib/mono/status";
import { formatMoney } from "@/lib/format";
import type { OutgoingTransfer } from "@/lib/mono/types";

const TERMINAL_STATES: OutgoingTransfer["state"][] = [
  "successful",
  "failed",
  "canceled",
  "reversed",
];

async function fetchTransfer(id: string): Promise<OutgoingTransfer> {
  const response = await fetch(`/api/transfers/${id}`);
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message ?? "No se pudo cargar la transferencia");
  }
  return response.json();
}

export function TransferDetail({ id }: { id: string }) {
  const { data, error, isPolling } = usePolling<OutgoingTransfer>({
    fetcher: () => fetchTransfer(id),
    isTerminal: (transfer) => TERMINAL_STATES.includes(transfer.state),
  });

  return (
    <div className="flex flex-col gap-4">
      <Link href="/transfers" className="text-sm text-brand-indigo hover:underline">
        ← Volver a transferencias
      </Link>

      {error && <ErrorState message={error.message} />}

      {data && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-ink">{data.external_id}</p>
              <p className="text-sm text-ink/60">{data.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {isPolling && <Spinner className="text-brand-indigo" />}
              <StatusBadge label={data.state} tone={transferStatusTone(data.state)} />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink/50">Monto</dt>
              <dd className="text-ink">{formatMoney(data.amount)}</dd>
            </div>
            {data.payer_name && (
              <div>
                <dt className="text-ink/50">Pagador</dt>
                <dd className="text-ink">{data.payer_name}</dd>
              </div>
            )}
            {data.state_reason && (
              <div>
                <dt className="text-ink/50">Motivo</dt>
                <dd className="text-danger">{data.state_reason}</dd>
              </div>
            )}
          </dl>
        </Card>
      )}
    </div>
  );
}
