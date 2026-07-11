import { clearTokenCache, getAccessToken } from "./auth";
import { throwIfError } from "./errors";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export async function monoFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const baseUrl = requireEnv("MONO_BREB_BASE_URL");
  const token = await getAccessToken();

  const doFetch = (accessToken: string) =>
    fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...init.headers,
      },
    });

  let response = await doFetch(token);

  if (response.status === 401) {
    clearTokenCache();
    const freshToken = await getAccessToken();
    response = await doFetch(freshToken);
  }

  await throwIfError(response);
  return (await response.json()) as T;
}

export function tenantAccountId(): string {
  return requireEnv("MONO_BREB_TENANT_ACCOUNT_ID");
}
