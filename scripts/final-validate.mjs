import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mustExist = [
  "apps/api/src/app.ts",
  "apps/api/prisma/schema.prisma",
  "apps/web/src/app/dashboard/page.tsx",
  "apps/mobile/app.config.ts",
  "apps/mobile/eas.json",
  "apps/mobile/app/(tabs)/nutrition.tsx",
  "apps/mobile/app/(tabs)/progress.tsx",
  "apps/mobile/app/(tabs)/health.tsx",
  "apps/api/prisma/migrations/202608130001_health_sync/migration.sql",
  ".github/workflows/ci.yml",
  ".github/workflows/release-gate.yml",
  ".github/workflows/mobile-build.yml",
  "docs/RELEASE_CHECKLIST.md",
  "docs/E2E_TEST_PLAN.md",
  "docs/FINAL_RELEASE.md",
  ".env.production.example"
];
const missing = mustExist.filter((f) => !fs.existsSync(path.join(root, f)));
if (missing.length) {
  console.error("Final validation failed. Missing critical files:");
  missing.forEach((f) => console.error(` - ${f}`));
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
if (pkg.version !== "1.0.0") {
  console.error(`Unexpected root version: ${pkg.version}`);
  process.exit(1);
}
for (const rel of ["apps/web/package.json", "apps/api/package.json", "apps/mobile/package.json"]) {
  const p = JSON.parse(fs.readFileSync(path.join(root, rel), "utf8"));
  if (p.version !== "1.0.0") {
    console.error(`Unexpected version in ${rel}: ${p.version}`);
    process.exit(1);
  }
}
const mobile = JSON.parse(fs.readFileSync(path.join(root, "apps/mobile/package.json"), "utf8"));
for (const script of ["build", "typecheck", "test", "native:prebuild", "eas:preview", "eas:production"]) {
  if (!mobile.scripts?.[script] || /node\s+-e|console\.log/.test(mobile.scripts[script])) {
    console.error(`Mobile script is missing or simulated: ${script}`);
    process.exit(1);
  }
}
const app = fs.readFileSync(path.join(root, "apps/api/src/app.ts"), "utf8");
for (const endpoint of ["/health/live", "/health/ready"]) {
  if (!app.includes(endpoint)) {
    console.error(`Missing health endpoint ${endpoint}`);
    process.exit(1);
  }
}
const env = fs.readFileSync(path.join(root, ".env.production.example"), "utf8");
const forbidden = ["sk_live_", "rk_live_", "sk_test_", "re_", "AKIA"];
for (const token of forbidden) {
  if (env.includes(token)) {
    console.error(`Potential secret-like token found in .env.production.example: ${token}`);
    process.exit(1);
  }
}
console.log("Final validation OK: critical files, versions, health endpoints, and production template verified.");
