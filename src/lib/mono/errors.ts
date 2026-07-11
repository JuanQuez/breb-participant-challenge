import type { MonoErrorEnvelope } from "./types";

export class MonoApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errorCode: string | null;
  readonly requestId: string | null;

  constructor(status: number, envelope: MonoErrorEnvelope) {
    super(envelope.message || "Bre-B API error");
    this.name = "MonoApiError";
    this.status = status;
    this.code = envelope.code;
    this.errorCode = envelope.errors[0]?.error_code ?? null;
    this.requestId = envelope.id ?? null;
  }
}

export async function throwIfError(response: Response): Promise<void> {
  if (response.ok) return;
  const body = await response.json().catch(() => null);
  if (body && typeof body === "object" && "message" in body) {
    throw new MonoApiError(response.status, body as MonoErrorEnvelope);
  }
  throw new MonoApiError(response.status, {
    code: String(response.status),
    message: response.statusText || "Unknown error",
    id: "",
    errors: [],
  });
}
