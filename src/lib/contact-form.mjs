/**
 * Builds an email draft without claiming that a message has been delivered.
 * Keeping this pure makes fallback behavior straightforward to regression-test.
 */
export function buildContactMailto({ name, email, message, intent = '' }) {
  const subject = `Inquiry: ${intent || 'General'}`;
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  return `mailto:hello@alhajikallon.dev?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
