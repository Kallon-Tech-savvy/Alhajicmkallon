import { spawnSync } from "node:child_process";
import { readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

const sourceRoot = resolve("src");
const probePath = resolve("src/packages/example/tests/boundary-probe.ts");
const sourceExtensions = /\\.(?:[cm]?[jt]sx?)$/;

function collectSourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return collectSourceFiles(path);
    return entry.isFile() && sourceExtensions.test(entry.name) ? [path] : [];
  });
}

function runBoundaries(label) {
  const files = collectSourceFiles(sourceRoot);
  if (files.length === 0) throw new Error("Boundary scan found no source files under src/.");
  const args = [
    "--yes",
    "--package=dependency-cruiser@17.3.7",
    "depcruise",
    "--config", ".dependency-cruiser.cjs",
    "--output-type", "err-long",
    ...files,
  ];
  const result = spawnSync("npx", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  console.log(`\\n--- ${label} (scanned ${files.length} source files; exit ${result.status ?? "spawn error"}) ---\\n${output}`);

  if (result.error) throw result.error;
  if (/\\(0 modules, 0 dependencies cruised\\)/.test(output)) {
    throw new Error("Dependency-cruiser scanned zero modules despite explicit source-file inputs.");
  }
  return { status: result.status, output };
}

const cleanBefore = runBoundaries("1/3 clean tree must pass");
if (cleanBefore.status !== 0) {
  throw new Error("Boundary check failed on the clean tree.");
}

try {
  writeFileSync(
    probePath,
    'import { buildGreeting } from "../lib/impl";\\nvoid buildGreeting;\\n',
    { flag: "wx" },
  );

  const deliberateViolation = runBoundaries("2/3 deliberate deep import must fail");
  if (
    deliberateViolation.status === 0 ||
    !deliberateViolation.output.includes("tests-through-entrypoints")
  ) {
    throw new Error(
      "The deliberate deep import did not fail specifically with tests-through-entrypoints.",
    );
  }
} finally {
  try {
    unlinkSync(probePath);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const cleanAfter = runBoundaries("3/3 restored tree must pass");
if (cleanAfter.status !== 0) {
  throw new Error("Boundary check still fails after removing the deliberate violation.");
}

console.log("\\nDeep-module boundary proof passed: pass → expected failure → pass.");
