import { rm } from "node:fs/promises";
import path from "node:path";

const homeDir = process.env.HOME || process.cwd();
const opencrabHome =
  process.env.OPENCRAB_HOME ||
  path.join(homeDir, ".opencrab");
const legacyOpencrabHome = path.join(homeDir, "Library", "Application Support", "OpenCrab");

const targets = [
  opencrabHome,
  legacyOpencrabHome,
  path.join(process.cwd(), ".playwright-cli"),
  path.join(process.cwd(), "output"),
  path.join(process.cwd(), "tmp"),
];

for (const target of targets) {
  await rm(target, { recursive: true, force: true }).catch(() => undefined);
}

process.stdout.write("Cleaned local runtime directories.\n");
