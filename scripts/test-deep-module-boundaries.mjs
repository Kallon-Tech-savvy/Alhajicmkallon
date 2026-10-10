import { spawnSync } from "node:child_process";
import { readdirSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const probePath = resolve("src/packages/example/tests/boundary-probe.ts");
const args = [
  "--yes",
  "dependency-cruiser@17.3.7",
  "--config",
  ".dependency-cruiser.cjs",
  "--output-type",
  "err-long",
];

function collectSourceFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (statSync(path).isDirectory()) return collectSourceFiles(path);
    return /\.(?:[cm]?[jt]sx?)$/.test(path) ? [path] : [];
  });
}

function runBoundaries(label) {
  const sourceFiles = collectSourceFiles("src");
  if (sourceFiles.length === 0) throw new Error("No source files found under src/.");
  const result = spawnSync("npx", [...args, ...sourceFiles], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
  console.log(`\n--- ${label} (exit ${result.status ?? "spawn error"}) ---\n${output}`);

  if (result.error) throw result.error;
  const moduleCountMatch = output.match(/\((\d+) modules?, \d+ dependencies cruised\)/);
  const moduleCount = moduleCountMatch ? Number(moduleCountMatch[1]) : 0;
  return { status: result.status, output, moduleCount };
}

const cleanBefore = runBoundaries("1/3 clean tree must pass");
if (cleanBefore.status !== 0 || cleanBefore.moduleCount === 0) {
  throw new Error("Boundary check failed on the clean tree.");
}

try {
  writeFileSync(
    probePath,
    'import { buildGreeting } from "../lib/impl";\nvoid buildGreeting;\n',
    { flag: "wx" },
  );

  const deliberateViolation = runBoundaries("2/3 deliberate deep import must fail");
  if (
    deliberateViolation.status === 0 ||
    deliberateViolation.moduleCount === 0 ||
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
if (cleanAfter.status !== 0 || cleanAfter.moduleCount === 0) {
  throw new Error("Boundary check still fails after removing the deliberate violation.");
}

console.log("\nDeep-module boundary proof passed: pass → expected failure → pass.");
