type TokenCache = {
  accessToken: string;
  expiresAt: number;
};

let cache: TokenCache | null = null;

export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cache && cache.expiresAt > now + 5000) {
    return cache.accessToken;
  }

  const baseUrl = requireEnv("MONO_BREB_BASE_URL");
  const clientId = requireEnv("MONO_BREB_CLIENT_ID");
  const clientSecret = requireEnv("MONO_BREB_CLIENT_SECRET");

  const response = await fetch(`${baseUrl}/api/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to obtain Bre-B access token: ${response.status}`);
  }

  const data = (await response.json()) as { access_token: string; expires_in: number };
  cache = {
    accessToken: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return cache.accessToken;
}

export function clearTokenCache(): void {
  cache = null;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
