import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  'package.json',
  'pnpm-workspace.yaml',
  'apps/web/package.json',
  'apps/api/package.json',
  'apps/mobile/package.json',
  'apps/mobile/app.config.ts',
  'apps/mobile/eas.json',
  'apps/api/prisma/schema.prisma',
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
console.log(`Release check OK: ${required.length} critical files present; no obvious live secrets detected.`);
