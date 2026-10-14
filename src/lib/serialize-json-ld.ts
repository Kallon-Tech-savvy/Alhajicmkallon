export function serializeJsonLd(value: Record<string, unknown>): string {
  // Prevent content values from terminating the surrounding script element.
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
