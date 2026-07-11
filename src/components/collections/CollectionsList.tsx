"use client";

import { useCallback, useEffect, useState } from "react";
import { CollectionCard } from "./CollectionCard";
import type { Collection } from "@/lib/mono/types";

export function CollectionsList({ refreshKey }: { refreshKey: number }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/collections");
      if (!response.ok) throw new Error("No se pudieron cargar los recaudos");
      const data = (await response.json()) as { collections: Collection[] };
      setCollections(data.collections);
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

  if (isLoading) return <p className="text-sm text-ink/60">Cargando recaudos...</p>;
  if (error) return <p className="text-sm text-danger">{error}</p>;
  if (collections.length === 0) return <p className="text-sm text-ink/60">Aún no hay recaudos.</p>;

  return (
    <div className="flex flex-col gap-3">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
}
