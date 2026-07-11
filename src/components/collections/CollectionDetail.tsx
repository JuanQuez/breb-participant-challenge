"use client";

import Link from "next/link";
import { usePolling } from "@/hooks/usePolling";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorState } from "@/components/ui/ErrorState";
import { collectionStatusTone } from "@/lib/mono/status";
import { formatMoney } from "@/lib/format";
import type { Collection } from "@/lib/mono/types";

const TERMINAL_STATES: Collection["state"][] = ["paid", "discarded", "failed"];

async function fetchCollection(id: string): Promise<Collection> {
  const response = await fetch(`/api/collections/${id}`);
  if (!response.ok) {
    const body = await response.json();
    throw new Error(body.message ?? "No se pudo cargar el recaudo");
  }
  return response.json();
}

export function CollectionDetail({ id }: { id: string }) {
  const { data, error, isPolling } = usePolling<Collection>({
    fetcher: () => fetchCollection(id),
    isTerminal: (collection) => TERMINAL_STATES.includes(collection.state),
  });

  return (
    <div className="flex flex-col gap-4">
      <Link href="/collections" className="text-sm text-brand-indigo hover:underline">
        ← Volver a recaudos
      </Link>

      {error && <ErrorState message={error.message} />}

      {data && (
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-ink">
                {data.nickname ?? data.external_id}
              </p>
              <p className="text-sm text-ink/60">{data.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {isPolling && <Spinner className="text-brand-indigo" />}
              <StatusBadge label={data.state} tone={collectionStatusTone(data.state)} />
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-ink/50">Pagado</dt>
              <dd className="text-ink">{formatMoney(data.paid_amount)}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Mínimo requerido</dt>
              <dd className="text-ink">{formatMoney(data.total_minimum_amount)}</dd>
            </div>
            <div>
              <dt className="text-ink/50">Máximo</dt>
              <dd className="text-ink">{formatMoney(data.total_maximum_amount)}</dd>
            </div>
            {data.state_reason && (
              <div>
                <dt className="text-ink/50">Motivo</dt>
                <dd className="text-danger">{data.state_reason}</dd>
              </div>
            )}
          </dl>

          {data.keys.length > 0 && (
            <div>
              <p className="mb-1 text-sm text-ink/50">Llave Bre-B</p>
              <p className="font-mono text-sm text-ink">{data.keys[0].value}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
