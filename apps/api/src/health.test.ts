import test from "node:test";
import assert from "node:assert/strict";
import { healthRecordSchema, healthSyncSchema, summarizeHealthRecords } from "./health.js";

const step = {
  type: "STEPS" as const,
  value: 1200,
  unit: "count",
  recordedAt: "2026-08-13T14:00:00.000Z",
  externalId: "steps-1"
};

test("health sync accepts a supported provider and metric", () => {
  assert.equal(healthSyncSchema.safeParse({ provider: "APPLE_HEALTH", records: [step] }).success, true);
});

test("health sync rejects unsupported providers", () => {
  assert.equal(healthSyncSchema.safeParse({ provider: "UNKNOWN", records: [step] }).success, false);
});

test("health records reject negative values", () => {
  assert.equal(healthRecordSchema.safeParse({ ...step, value: -1 }).success, false);
});

test("health sync caps a request at 500 records", () => {
  assert.equal(healthSyncSchema.safeParse({ provider: "HEALTH_CONNECT", records: Array.from({ length: 501 }, () => step) }).success, false);
});

test("health summaries aggregate values and retain the latest timestamp", () => {
  const summary = summarizeHealthRecords([
    step,
    { ...step, value: 800, recordedAt: "2026-08-13T15:00:00.000Z", externalId: "steps-2" }
  ]);
  assert.equal(summary.totals.STEPS, 2000);
  assert.equal(summary.records, 2);
  assert.equal(summary.lastRecordedAt, "2026-08-13T15:00:00.000Z");
});
