/** Browser-safe enquiry choices and routing policy shared by the form and server. */
export const CONTACT_INTENTS = Object.freeze([
  'Clarify an idea',
  'Design and build a product',
  'Improve a product',
  'Suggest a guide or correction',
  'Something else',
]);

export function isDevelopmentEnquiry(intent) {
  return intent === 'Design and build a product' || intent === 'Improve a product';
}
