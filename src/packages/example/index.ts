import { buildGreeting } from "./lib/impl";

/** Public example behaviour: implementation details remain private. */
export function exampleGreeting(name: string): string {
  return buildGreeting(name);
}
