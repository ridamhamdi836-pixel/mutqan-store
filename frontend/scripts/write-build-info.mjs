/**
 * Writes public/build-info.json with git SHA for /api/health-deploy verification.
 * Run automatically before `next build`.
 */
import { execSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const outDir = path.join(root, "public");
const outFile = path.join(outDir, "build-info.json");

let gitCommit = "unknown";
let gitCommitShort = "unknown";

try {
  gitCommit = execSync("git rev-parse HEAD", { encoding: "utf8" }).trim();
  gitCommitShort = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
} catch {
  // Docker build may not include .git — set GIT_COMMIT env in Easypanel build args
  gitCommit = process.env.GIT_COMMIT ?? process.env.EASYPANEL_GIT_COMMIT ?? "unknown";
  gitCommitShort = gitCommit.slice(0, 7);
}

const payload = {
  git_commit: gitCommit,
  git_commit_short: gitCommitShort,
  built_at: new Date().toISOString(),
};

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, JSON.stringify(payload, null, 2) + "\n", "utf8");
console.log(`build-info: ${gitCommitShort} (${gitCommit})`);
