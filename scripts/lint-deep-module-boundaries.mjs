import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const sourceRoot = resolve("src");
const sourceExtensions = /\.(?:[cm]?[jt]sx?)$/;

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return entry.isFile() && sourceExtensions.test(entry.name) ? [path] : [];
  });
}

const files = collectSourceFiles(sourceRoot);
if (files.length === 0) {
  throw new Error("Boundary lint found no source files under src/.");
}

const result = spawnSync(
  "npx",
  [
    "--yes",
    "--package=dependency-cruiser@17.3.7",
    "depcruise",
    "--config", ".dependency-cruiser.cjs",
    "--output-type", "err-long",
    ...files,
  ],
  { encoding: "utf8", stdio: "inherit" },
);

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
