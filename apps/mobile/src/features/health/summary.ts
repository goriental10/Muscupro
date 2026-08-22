import type { HealthMetricType } from "./types";

export type HealthSummary = {
  totals: Partial<Record<HealthMetricType, number>>;
  lastRecordedAt: string | null;
  records: number;
};

export function rounded(value: number | undefined, digits = 0) {
  if (value === undefined) return "—";
  return value.toLocaleString("fr-CA", { maximumFractionDigits: digits });
}

export function syncLabel(timestamp: string | null) {
  if (!timestamp) return "Aucune synchronisation";
  return new Date(timestamp).toLocaleString("fr-CA", { dateStyle: "medium", timeStyle: "short" });
}
