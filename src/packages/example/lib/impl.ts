/** Private implementation; consumers should import ../index instead. */
export function buildGreeting(name: string): string {
  const normalizedName = name.trim();
  return normalizedName.length > 0
    ? `Hello, ${normalizedName}!`
    : "Hello!";
}
