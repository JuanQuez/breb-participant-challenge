"use client";

import { useState } from "react";
import { TransferForm } from "@/components/transfers/TransferForm";
import { TransfersList } from "@/components/transfers/TransfersList";
import { Card } from "@/components/ui/Card";

export default function TransfersPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Transferencias salientes</h1>
        <p className="text-sm text-ink/60">Resuelve una llave Bre-B y envía dinero.</p>
      </div>
      <Card>
        <TransferForm onCreated={() => setRefreshKey((key) => key + 1)} />
      </Card>
      <TransfersList refreshKey={refreshKey} />
    </main>
  );
}
