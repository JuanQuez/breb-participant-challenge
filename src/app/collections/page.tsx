"use client";

import { useState } from "react";
import { CollectionForm } from "@/components/collections/CollectionForm";
import { CollectionsList } from "@/components/collections/CollectionsList";
import { Card } from "@/components/ui/Card";

export default function CollectionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Recaudos</h1>
        <p className="text-sm text-ink/60">Crea y consulta recaudos de Bre-B.</p>
      </div>
      <Card>
        <CollectionForm onCreated={() => setRefreshKey((key) => key + 1)} />
      </Card>
      <CollectionsList refreshKey={refreshKey} />
    </main>
  );
}
