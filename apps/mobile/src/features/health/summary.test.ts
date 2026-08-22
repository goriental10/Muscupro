import test from "node:test";
import assert from "node:assert/strict";
import { rounded, syncLabel } from "./summary.js";

test("rounded displays a dash when a metric is unavailable", () => {
  assert.equal(rounded(undefined), "—");
});

test("rounded keeps the requested precision", () => {
  assert.match(rounded(4.26, 1), /4[,.]3/);
});

test("syncLabel handles a missing timestamp", () => {
  assert.equal(syncLabel(null), "Aucune synchronisation");
});
