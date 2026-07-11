import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearTokenCache, getAccessToken } from "@/lib/mono/auth";

const ENV_KEYS = ["MONO_BREB_BASE_URL", "MONO_BREB_CLIENT_ID", "MONO_BREB_CLIENT_SECRET"];

function setEnv() {
  process.env.MONO_BREB_BASE_URL = "https://example-sandbox.mono.la";
  process.env.MONO_BREB_CLIENT_ID = "test-client";
  process.env.MONO_BREB_CLIENT_SECRET = "test-secret";
}

describe("getAccessToken", () => {
  beforeEach(() => {
    setEnv();
    clearTokenCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    for (const key of ENV_KEYS) delete process.env[key];
  });

  it("fetches a token from the oauth endpoint using client_credentials", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ access_token: "token-1", expires_in: 3600 }), {
          status: 200,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const token = await getAccessToken();

    expect(token).toBe("token-1");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example-sandbox.mono.la/api/v1/oauth/token",
      expect.objectContaining({ method: "POST" }),
    );
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body).toMatchObject({
      client_id: "test-client",
      client_secret: "test-secret",
      grant_type: "client_credentials",
    });
  });

  it("reuses the cached token on a second call", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        new Response(JSON.stringify({ access_token: "token-1", expires_in: 3600 }), {
          status: 200,
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    await getAccessToken();
    await getAccessToken();

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("throws when a required env variable is missing", async () => {
    delete process.env.MONO_BREB_CLIENT_ID;
    await expect(getAccessToken()).rejects.toThrow(
      "Missing required environment variable: MONO_BREB_CLIENT_ID",
    );
  });

  it("throws when the token endpoint responds with an error status", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("", { status: 401 })));
    await expect(getAccessToken()).rejects.toThrow("Failed to obtain Bre-B access token: 401");
  });
});
