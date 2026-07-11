import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { transferStatusTone } from "@/lib/mono/status";
import { formatMoney } from "@/lib/format";
import type { OutgoingTransfer } from "@/lib/mono/types";

export function TransferCard({ transfer }: { transfer: OutgoingTransfer }) {
  return (
    <Link href={`/transfers/${transfer.id}`}>
      <Card className="flex items-center justify-between gap-4 transition hover:border-brand-pink/40">
        <div>
          <p className="font-medium text-ink">{transfer.external_id}</p>
          <p className="text-sm text-ink/60">{transfer.id}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-ink/70">{formatMoney(transfer.amount)}</span>
          <StatusBadge label={transfer.state} tone={transferStatusTone(transfer.state)} />
        </div>
      </Card>
    </Link>
  );
}
