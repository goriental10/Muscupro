import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'package.json',
  'pnpm-workspace.yaml',
  'pnpm-lock.yaml',
  'apps/web/package.json',
  'apps/web/vercel.json',
  'apps/api/package.json',
  'apps/api/Dockerfile',
  'apps/mobile/package.json',
  'apps/mobile/app.config.ts',
  'apps/mobile/eas.json',
  'apps/mobile/app/(tabs)/nutrition.tsx',
  'apps/mobile/app/(tabs)/progress.tsx',
  'apps/mobile/app/(tabs)/health.tsx',
  'apps/api/prisma/schema.prisma',
  'apps/api/prisma/migrations/202608130001_health_sync/migration.sql',
  'railway.json',
  'docs/DEPLOY_RAILWAY_VERCEL.md',
  '.env.production.example',
  '.github/workflows/ci.yml',
  '.github/workflows/mobile-build.yml',
];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) {
  console.error('Release check failed. Missing files:');
  for (const file of missing) console.error(` - ${file}`);
  process.exit(1);
}

const forbiddenPatterns = [
  /sk_live_[A-Za-z0-9]+/g,
  /re_[A-Za-z0-9]{20,}/g,
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,
];
const excluded = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.expo']);
let issues = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (excluded.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && fs.statSync(full).size < 2_000_000) {
      let text;
      try { text = fs.readFileSync(full, 'utf8'); } catch { continue; }
      for (const re of forbiddenPatterns) {
        if (re.test(text)) issues.push(path.relative(root, full));
        re.lastIndex = 0;
      }
    }
  }
}
walk(root);
if (issues.length) {
  console.error('Potential secrets detected:');
  for (const file of [...new Set(issues)]) console.error(` - ${file}`);
  process.exit(1);
}

const envTemplate = fs.readFileSync(path.join(root, '.env.production.example'), 'utf8');
for (const key of ['DATABASE_URL=', 'JWT_SECRET=', 'WEB_ORIGIN=', 'API_URL=', 'AUTH_SECRET=']) {
  if (!envTemplate.includes(key)) {
    console.error(`Release check failed. Missing ${key} in .env.production.example`);
    process.exit(1);
  }
}

const railway = JSON.parse(fs.readFileSync(path.join(root, 'railway.json'), 'utf8'));
if (railway?.build?.dockerfilePath !== 'apps/api/Dockerfile') {
  console.error('Release check failed. railway.json must target apps/api/Dockerfile');
  process.exit(1);
}
if (railway?.deploy?.healthcheckPath !== '/health/ready') {
  console.error('Release check failed. railway.json must target /health/ready healthcheck');
  process.exit(1);
}

const mobilePackage = JSON.parse(fs.readFileSync(path.join(root, 'apps/mobile/package.json'), 'utf8'));
for (const script of ['build', 'typecheck', 'test', 'native:prebuild', 'eas:preview', 'eas:production']) {
  const command = mobilePackage.scripts?.[script];
  if (!command || /node\s+-e|console\.log/.test(command)) {
    console.error(`Release check failed. Mobile script ${script} is missing or simulated.`);
    process.exit(1);
  }
}
if (!String(mobilePackage.dependencies?.expo).startsWith('~57.')) {
  console.error('Release check failed. Mobile must target Expo SDK 57.');
  process.exit(1);
}

const mobileWorkflow = fs.readFileSync(path.join(root, '.github/workflows/mobile-build.yml'), 'utf8');
for (const token of ['eas build', '--non-interactive', 'EXPO_TOKEN', 'EXPO_PROJECT_ID']) {
  if (!mobileWorkflow.includes(token)) {
    console.error(`Release check failed. Mobile workflow is missing ${token}.`);
    process.exit(1);
  }
}
console.log(`Release check OK: ${required.length} critical files present; no obvious live secrets detected.`);
