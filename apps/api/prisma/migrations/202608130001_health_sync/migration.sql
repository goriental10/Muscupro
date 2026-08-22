CREATE TYPE "HealthProvider" AS ENUM ('APPLE_HEALTH', 'HEALTH_CONNECT');
CREATE TYPE "HealthMetricType" AS ENUM ('STEPS', 'ACTIVE_ENERGY_KCAL', 'HEART_RATE_BPM', 'SLEEP_MINUTES', 'WEIGHT_KG', 'WORKOUT_MINUTES', 'DISTANCE_KM');

CREATE TABLE "HealthMetric" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" "HealthProvider" NOT NULL,
    "type" "HealthMetricType" NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL,
    "externalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HealthMetric_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "HealthMetric_userId_provider_externalId_key" ON "HealthMetric"("userId", "provider", "externalId");
CREATE INDEX "HealthMetric_userId_type_recordedAt_idx" ON "HealthMetric"("userId", "type", "recordedAt");

ALTER TABLE "HealthMetric" ADD CONSTRAINT "HealthMetric_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
