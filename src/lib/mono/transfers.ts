import { monoFetch, tenantAccountId } from "./client";
import type { OutgoingTransfer, ResolvedTarget, ResolveTargetFormat } from "./types";

export async function resolveTarget(
  format: ResolveTargetFormat,
  value: string,
): Promise<ResolvedTarget> {
  return monoFetch<ResolvedTarget>("/api/v1/targets/resolve", {
    method: "POST",
    body: JSON.stringify({
      tenant_account_id: tenantAccountId(),
      format,
      value,
    }),
  });
}

export async function createTransfer(
  externalId: string,
  targetId: string,
): Promise<{ accepted_transfers: OutgoingTransfer[]; rejected_transfers: unknown[] }> {
  return monoFetch("/api/v1/outgoing_transfers", {
    method: "POST",
    body: JSON.stringify({
      tenant_account_id: tenantAccountId(),
      transfers: [{ external_id: externalId, target_id: targetId }],
    }),
  });
}

export async function getTransfer(id: string): Promise<OutgoingTransfer> {
  return monoFetch<OutgoingTransfer>(`/api/v1/outgoing_transfers/${id}`);
}

export async function listTransfers(): Promise<{ transfers: OutgoingTransfer[] }> {
  return monoFetch<{ transfers: OutgoingTransfer[] }>("/api/v1/outgoing_transfers");
}
