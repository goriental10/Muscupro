import type { HealthMetric } from "./types";

export async function readHealthConnect(days: number): Promise<HealthMetric[]> {
  const hc: any = await import("react-native-health-connect");
  if (!(await hc.initialize())) throw new Error("Health Connect n’est pas disponible sur cet appareil.");
  await hc.requestPermission([
    { accessType: "read", recordType: "Steps" },
    { accessType: "read", recordType: "ActiveCaloriesBurned" },
    { accessType: "read", recordType: "Weight" },
    { accessType: "read", recordType: "Distance" }
  ]);
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - days * 86_400_000);
  const timeRangeFilter = { operator: "between", startTime: startTime.toISOString(), endTime: endTime.toISOString() };
  const out: HealthMetric[] = [];

  const steps = await hc.readRecords("Steps", { timeRangeFilter });
  for (const r of steps.records ?? []) out.push({ type: "STEPS", value: Number(r.count), unit: "count", recordedAt: r.endTime, externalId: r.metadata?.id });
  const calories = await hc.readRecords("ActiveCaloriesBurned", { timeRangeFilter });
  for (const r of calories.records ?? []) out.push({ type: "ACTIVE_ENERGY_KCAL", value: Number(r.energy?.inKilocalories ?? 0), unit: "kcal", recordedAt: r.endTime, externalId: r.metadata?.id });
  const weights = await hc.readRecords("Weight", { timeRangeFilter });
  for (const r of weights.records ?? []) out.push({ type: "WEIGHT_KG", value: Number(r.weight?.inKilograms ?? 0), unit: "kg", recordedAt: r.time, externalId: r.metadata?.id });
  const distances = await hc.readRecords("Distance", { timeRangeFilter });
  for (const r of distances.records ?? []) out.push({ type: "DISTANCE_KM", value: Number(r.distance?.inKilometers ?? 0), unit: "km", recordedAt: r.endTime, externalId: r.metadata?.id });
  return out.filter((r) => Number.isFinite(r.value));
}
