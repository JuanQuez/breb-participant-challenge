import { describe, expect, it } from "vitest";
import { MonoApiError, throwIfError } from "@/lib/mono/errors";

describe("throwIfError", () => {
  it("does nothing when response is ok", async () => {
    const response = new Response(JSON.stringify({ ok: true }), { status: 200 });
    await expect(throwIfError(response)).resolves.toBeUndefined();
  });

  it("throws MonoApiError with the envelope fields when response has an error body", async () => {
    const body = {
      code: "400 Bad Request",
      message: "Malformed request",
      id: "log_123",
      errors: [{ error_code: "unknown", message: "Unknown error", path: null, url: null }],
    };
    const response = new Response(JSON.stringify(body), { status: 400 });

    await expect(throwIfError(response)).rejects.toMatchObject({
      status: 400,
      code: "400 Bad Request",
      errorCode: "unknown",
      message: "Malformed request",
    });
  });

  it("falls back to a generic error when the body cannot be parsed", async () => {
    const response = new Response("not json", {
      status: 500,
      statusText: "Internal Server Error",
    });

    await expect(throwIfError(response)).rejects.toMatchObject({
      status: 500,
      errorCode: null,
    });
  });
});

describe("MonoApiError", () => {
  it("exposes status, code, errorCode and requestId", () => {
    const error = new MonoApiError(401, {
      code: "401 Unauthorized",
      message: "Authorization header is missing or invalid.",
      id: "log_abc",
      errors: [{ error_code: "invalid_token", message: "bad token", path: null, url: null }],
    });

    expect(error.status).toBe(401);
    expect(error.code).toBe("401 Unauthorized");
    expect(error.errorCode).toBe("invalid_token");
    expect(error.requestId).toBe("log_abc");
    expect(error.message).toBe("Authorization header is missing or invalid.");
  });
});
