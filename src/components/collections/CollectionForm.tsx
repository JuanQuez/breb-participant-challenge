"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function CollectionForm({ onCreated }: { onCreated: () => void }) {
  const [externalId, setExternalId] = useState("");
  const [nickname, setNickname] = useState("");
  const [usageMode, setUsageMode] = useState<"single_use" | "multiple_use">("single_use");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          external_id: externalId,
          usage_mode: usageMode,
          nickname: nickname || undefined,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message ?? "No se pudo crear el recaudo");
      }

      setExternalId("");
      setNickname("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label className="text-sm font-medium text-ink">
        ID externo
        <Input
          value={externalId}
          onChange={(e) => setExternalId(e.target.value)}
          placeholder="invoice-12345"
          required
          className="mt-1"
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Nombre (opcional)
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Suscripción mensual"
          className="mt-1"
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Tipo de uso
        <select
          value={usageMode}
          onChange={(e) => setUsageMode(e.target.value as "single_use" | "multiple_use")}
          className="mt-1 w-full rounded-lg border border-ink/15 bg-white px-3 py-2 text-sm text-ink"
        >
          <option value="single_use">Uso único</option>
          <option value="multiple_use">Uso múltiple</option>
        </select>
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creando..." : "Crear recaudo"}
      </Button>
    </form>
  );
}
