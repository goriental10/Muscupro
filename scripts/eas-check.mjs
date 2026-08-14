import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const mobileRoot = path.join(root, "apps/mobile");
const fail = (message) => {
  console.error(`EAS check failed: ${message}`);
  process.exit(1);
};

const easPath = path.join(mobileRoot, "eas.json");
if (!fs.existsSync(easPath)) fail("apps/mobile/eas.json is missing");

const eas = JSON.parse(fs.readFileSync(easPath, "utf8"));
for (const profile of ["development", "preview", "production"]) {
  if (!eas.build?.[profile]) fail(`missing ${profile} build profile`);
}
if (eas.build.development.developmentClient !== true) fail("development profile must enable developmentClient");
if (eas.build.preview.distribution !== "internal") fail("preview profile must use internal distribution");

const config = fs.readFileSync(path.join(mobileRoot, "app.config.ts"), "utf8");
for (const value of ["com.goriental10.muscupro", "EXPO_PUBLIC_EAS_PROJECT_ID", "EXPO_PUBLIC_API_URL"]) {
  if (!config.includes(value)) fail(`app config is missing ${value}`);
}

const workflow = fs.readFileSync(path.join(root, ".github/workflows/mobile-build.yml"), "utf8");
for (const value of ["EXPO_TOKEN", "EXPO_PROJECT_ID", "eas build", "--non-interactive"]) {
  if (!workflow.includes(value)) fail(`mobile workflow is missing ${value}`);
}

console.log("EAS check OK: app identifiers, profiles, and CI credential contract verified.");
