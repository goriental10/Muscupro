import { z } from "zod";

export const healthProviderSchema = z.enum(["APPLE_HEALTH", "HEALTH_CONNECT"]);
export const healthMetricTypeSchema = z.enum([
  "STEPS",
  "ACTIVE_ENERGY_KCAL",
  "HEART_RATE_BPM",
  "SLEEP_MINUTES",
  "WEIGHT_KG",
  "WORKOUT_MINUTES",
  "DISTANCE_KM"
]);

export const healthRecordSchema = z.object({
  type: healthMetricTypeSchema,
  value: z.number().finite().nonnegative(),
  unit: z.string().trim().min(1).max(24),
  recordedAt: z.string().datetime({ offset: true }),
  externalId: z.string().trim().min(1).max(200).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export const healthSyncSchema = z.object({
  provider: healthProviderSchema,
  records: z.array(healthRecordSchema).min(1).max(500)
});

export type HealthRecord = z.infer<typeof healthRecordSchema>;

export function summarizeHealthRecords(records: HealthRecord[]) {
  const totals: Partial<Record<HealthRecord["type"], number>> = {};
  let lastRecordedAt: string | null = null;

  for (const record of records) {
    totals[record.type] = (totals[record.type] ?? 0) + record.value;
    if (!lastRecordedAt || record.recordedAt > lastRecordedAt) lastRecordedAt = record.recordedAt;
  }

  return { totals, lastRecordedAt, records: records.length };
}
