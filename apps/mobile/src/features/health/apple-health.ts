import type { HealthMetric } from "./types";

function samplesOf(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object" && Array.isArray((value as any).samples)) return (value as any).samples;
  return [];
}

export async function readAppleHealth(days: number): Promise<HealthMetric[]> {
  // HealthKit is native: use a development/production build, never Expo Go.
  const hk: any = await import("@kingstinct/react-native-healthkit");
  if (typeof hk.isHealthDataAvailable === "function" && !(await hk.isHealthDataAvailable())) {
    throw new Error("HealthKit n’est pas disponible sur cet appareil.");
  }
  const from = new Date(Date.now() - days * 86_400_000);
  const to = new Date();
  const toRead = [
    "HKQuantityTypeIdentifierStepCount",
    "HKQuantityTypeIdentifierActiveEnergyBurned",
    "HKQuantityTypeIdentifierBodyMass",
    "HKQuantityTypeIdentifierDistanceWalkingRunning"
  ];
  await hk.requestAuthorization({ toRead });
  const options = { filter: { date: { startDate: from, endDate: to } }, limit: 500 };
  const out: HealthMetric[] = [];

  for (const r of samplesOf(await hk.queryQuantitySamples("HKQuantityTypeIdentifierStepCount", options))) {
    out.push({ type: "STEPS", value: Number(r.quantity), unit: r.unit ?? "count", recordedAt: new Date(r.endDate).toISOString(), externalId: r.uuid });
  }
  for (const r of samplesOf(await hk.queryQuantitySamples("HKQuantityTypeIdentifierActiveEnergyBurned", options))) {
    out.push({ type: "ACTIVE_ENERGY_KCAL", value: Number(r.quantity), unit: r.unit ?? "kcal", recordedAt: new Date(r.endDate).toISOString(), externalId: r.uuid });
  }
  for (const r of samplesOf(await hk.queryQuantitySamples("HKQuantityTypeIdentifierBodyMass", options))) {
    out.push({ type: "WEIGHT_KG", value: Number(r.quantity), unit: r.unit ?? "kg", recordedAt: new Date(r.endDate).toISOString(), externalId: r.uuid });
  }
  for (const r of samplesOf(await hk.queryQuantitySamples("HKQuantityTypeIdentifierDistanceWalkingRunning", options))) {
    out.push({ type: "DISTANCE_KM", value: Number(r.quantity), unit: r.unit ?? "km", recordedAt: new Date(r.endDate).toISOString(), externalId: r.uuid });
  }
  return out.filter((r) => Number.isFinite(r.value));
}
