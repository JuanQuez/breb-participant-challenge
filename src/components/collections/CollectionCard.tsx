import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { collectionStatusTone } from "@/lib/mono/status";
import { formatMoney } from "@/lib/format";
import type { Collection } from "@/lib/mono/types";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.id}`}>
      <Card className="flex items-center justify-between gap-4 transition hover:border-brand-pink/40">
        <div>
          <p className="font-medium text-ink">{collection.nickname ?? collection.external_id}</p>
          <p className="text-sm text-ink/60">{collection.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink/70">{formatMoney(collection.paid_amount)}</span>
          <StatusBadge label={collection.state} tone={collectionStatusTone(collection.state)} />
        </div>
      </Card>
    </Link>
  );
}
