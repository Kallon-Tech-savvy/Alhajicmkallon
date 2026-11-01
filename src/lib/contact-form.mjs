/**
 * Builds an email draft without claiming that a message has been delivered.
 * Product implementation enquiries go to the development inbox; other enquiries
 * go to the general inbox.
 */
export function buildContactMailto({ name, email, message, intent = '' }) {
  const developmentIntents = new Set([
    'Design and build a product',
    'Improve a product',
  ]);
  const recipient = developmentIntents.has(intent)
    ? 'dev@alhajikallon.com'
    : 'info@alhajikallon.com';
  const subject = `Inquiry: ${intent || 'General'}`;
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
