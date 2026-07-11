"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function TransferForm({ onCreated }: { onCreated: () => void }) {
  const [externalId, setExternalId] = useState("");
  const [key, setKey] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const resolveResponse = await fetch("/api/targets/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format: "plain_key", value: key }),
      });
      const resolved = await resolveResponse.json();
      if (!resolveResponse.ok) {
        throw new Error(resolved.message ?? "No se pudo resolver la llave destino");
      }
      if (resolved.state !== "resolved" || !resolved.target) {
        throw new Error(resolved.state_reason ?? "La llave no pudo resolverse");
      }

      const transferResponse = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ external_id: externalId, target_id: resolved.target.id }),
      });
      const transferBody = await transferResponse.json();
      if (!transferResponse.ok) {
        throw new Error(transferBody.message ?? "No se pudo crear la transferencia");
      }

      setExternalId("");
      setKey("");
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
          placeholder="transfer_001"
          required
          className="mt-1"
        />
      </label>
      <label className="text-sm font-medium text-ink">
        Llave Bre-B destino
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="@MNDESTINATARIO"
          required
          className="mt-1"
        />
      </label>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Enviar transferencia"}
      </Button>
    </form>
  );
}
