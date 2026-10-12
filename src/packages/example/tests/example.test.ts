import assert from "node:assert/strict";
import test from "node:test";
import { exampleGreeting } from "../index";

test("example package exposes its greeting through the entry point", () => {
  assert.equal(exampleGreeting("Ada"), "Hello, Ada!");
});

test("example package handles an empty name", () => {
  assert.equal(exampleGreeting("   "), "Hello!");
});
