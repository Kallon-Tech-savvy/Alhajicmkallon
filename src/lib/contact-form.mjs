import { isDevelopmentEnquiry } from './contact-intents.mjs';

/**
 * Builds an email draft without claiming that a message has been delivered.
 * Product implementation enquiries go to the development inbox; other enquiries
 * go to the general inbox.
 */
export function buildContactMailto({ name, email, message, intent = '' }) {
  const recipient = isDevelopmentEnquiry(intent) ? 'dev@alhajikallon.com' : 'info@alhajikallon.com';
  const subject = `Inquiry: ${intent || 'General'}`;
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
