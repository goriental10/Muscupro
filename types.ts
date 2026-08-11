export type HealthProvider = "APPLE_HEALTH" | "HEALTH_CONNECT";
export type HealthMetricType = "STEPS" | "ACTIVE_ENERGY_KCAL" | "HEART_RATE_BPM" | "SLEEP_MINUTES" | "WEIGHT_KG" | "WORKOUT_MINUTES" | "DISTANCE_KM";
export type HealthMetric = { type: HealthMetricType; value: number; unit: string; recordedAt: string; externalId?: string; metadata?: Record<string, unknown> };
