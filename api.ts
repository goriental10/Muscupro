import { API_URL } from "./config";
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from "./auth";

async function refreshAccessToken() {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  if (!response.ok) {
    await clearTokens();
    return null;
  }
  const data = await response.json() as { accessToken: string; refreshToken?: string };
  await saveTokens(data.accessToken, data.refreshToken ?? refreshToken);
  return data.accessToken;
}

export async function api<T>(path: string, init: RequestInit = {}, retry = true): Promise<T> {
  let token = await getAccessToken();
  const headers = new Headers(init.headers);
  if (!headers.has("Content-Type") && init.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let response = await fetch(`${API_URL}${path}`, { ...init, headers });
  if (response.status === 401 && retry) {
    token = await refreshAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
      response = await fetch(`${API_URL}${path}`, { ...init, headers });
    }
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({ message: `HTTP ${response.status}` }));
    throw new Error(body.message ?? body.code ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}
