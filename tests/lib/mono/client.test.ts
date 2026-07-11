import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/mono/auth", () => ({
  getAccessToken: vi.fn(),
  clearTokenCache: vi.fn(),
}));

import { clearTokenCache, getAccessToken } from "@/lib/mono/auth";
import { monoFetch, tenantAccountId } from "@/lib/mono/client";

const mockedGetAccessToken = vi.mocked(getAccessToken);
const mockedClearTokenCache = vi.mocked(clearTokenCache);

describe("monoFetch", () => {
  beforeEach(() => {
    process.env.MONO_BREB_BASE_URL = "https://example-sandbox.mono.la";
    process.env.MONO_BREB_TENANT_ACCOUNT_ID = "bbtacc_test";
    vi.restoreAllMocks();
    mockedGetAccessToken.mockReset();
    mockedClearTokenCache.mockReset();
  });

  it("attaches the bearer token and returns parsed JSON on success", async () => {
    mockedGetAccessToken.mockResolvedValue("token-1");
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ hello: "world" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await monoFetch<{ hello: string }>("/api/v1/collections");

    expect(result).toEqual({ hello: "world" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example-sandbox.mono.la/api/v1/collections",
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer token-1" }),
      }),
    );
  });

  it("refreshes the token and retries once on a 401", async () => {
    mockedGetAccessToken
      .mockResolvedValueOnce("stale-token")
      .mockResolvedValueOnce("fresh-token");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "expired" }), { status: 401 }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const result = await monoFetch<{ ok: boolean }>("/api/v1/collections");

    expect(result).toEqual({ ok: true });
    expect(mockedClearTokenCache).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws MonoApiError when the response is a non-401 error", async () => {
    mockedGetAccessToken.mockResolvedValue("token-1");
    const errorBody = {
      code: "404 Not Found",
      message: "Resource not defined",
      id: "log_1",
      errors: [
        { error_code: "tenant_account_not_found", message: "not found", path: null, url: null },
      ],
    };
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify(errorBody), { status: 404 })),
    );

    await expect(monoFetch("/api/v1/collections")).rejects.toMatchObject({ status: 404 });
  });
});

describe("tenantAccountId", () => {
  it("returns the configured tenant account id", () => {
    process.env.MONO_BREB_TENANT_ACCOUNT_ID = "bbtacc_test";
    expect(tenantAccountId()).toBe("bbtacc_test");
  });
});
