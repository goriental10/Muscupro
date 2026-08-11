import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const mustExist = [
  'apps/api/src/app.ts',
  'apps/api/prisma/schema.prisma',
  'apps/web/src/app/dashboard/page.tsx',
  'apps/mobile/app.config.ts',
  '.github/workflows/ci.yml',
  '.github/workflows/release-gate.yml',
  '.github/workflows/mobile-build.yml',
  'docs/RELEASE_CHECKLIST.md',
  'docs/E2E_TEST_PLAN.md',
  'docs/RELEASE_CANDIDATE.md',
  '.env.production.example'
];
const missing = mustExist.filter(f => !fs.existsSync(path.join(root,f)));
if (missing.length) {
  console.error('RC validation failed. Missing critical files:');
  missing.forEach(f => console.error(` - ${f}`));
  process.exit(1);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
if (pkg.version !== '1.0.0-rc.1') {
  console.error(`Unexpected root version: ${pkg.version}`);
  process.exit(1);
}
const app = fs.readFileSync(path.join(root,'apps/api/src/app.ts'),'utf8');
for (const endpoint of ['/health/live','/health/ready']) {
  if (!app.includes(endpoint)) {
    console.error(`Missing health endpoint ${endpoint}`);
    process.exit(1);
  }
}
console.log('RC validation OK: critical files, version, and health endpoints verified.');
