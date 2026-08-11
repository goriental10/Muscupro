import { Platform } from "react-native";
import { api } from "../../lib/api";
import type { HealthMetric, HealthProvider } from "./types";

export async function ingestHealth(provider: HealthProvider, records: HealthMetric[]) {
  if (!records.length) return { accepted: 0 };
  return api<{ accepted: number }>("/api/v1/health/sync/ingest", {
    method: "POST",
    body: JSON.stringify({ provider, records: records.slice(0, 500) })
  });
}

export async function syncNativeHealth(days = 7) {
  if (Platform.OS === "ios") {
    const { readAppleHealth } = await import("./apple-health");
    return ingestHealth("APPLE_HEALTH", await readAppleHealth(days));
  }
  if (Platform.OS === "android") {
    const { readHealthConnect } = await import("./health-connect");
    return ingestHealth("HEALTH_CONNECT", await readHealthConnect(days));
  }
  throw new Error("La synchronisation santé native est disponible uniquement sur iOS et Android.");
}
