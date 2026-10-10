import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

function collectSourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return collectSourceFiles(path);
    return /\.(?:[cm]?[jt]sx?)$/.test(path) ? [path] : [];
  });
}

const sourceFiles = collectSourceFiles("src");
if (sourceFiles.length === 0) {
  console.error("No source files found under src/; refusing an empty boundary scan.");
  process.exit(1);
}

const result = spawnSync(
  "npx",
  [
    "--yes",
    "dependency-cruiser@17.3.7",
    "--config",
    ".dependency-cruiser.cjs",
    "--output-type",
    "err-long",
    ...sourceFiles,
  ],
  { stdio: "inherit" },
);

if (result.error) throw result.error;
process.exit(result.status ?? 1);
