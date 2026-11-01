import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContactMailto } from '../src/lib/contact-form.mjs';

test('routes general enquiries to the information inbox', () => {
  const draft = new URL(buildContactMailto({
    name: 'Aminata Conteh',
    email: 'aminata@example.com',
    message: 'I have a question.',
  }));

  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, 'info@alhajikallon.com');
  assert.equal(draft.searchParams.get('subject'), 'Inquiry: General');
  assert.equal(
    draft.searchParams.get('body'),
    'Name: Aminata Conteh\nEmail: aminata@example.com\n\nI have a question.',
  );
});

test('routes product development enquiries to the development inbox', () => {
  for (const intent of ['Design and build a product', 'Improve a product']) {
    const draft = new URL(buildContactMailto({
      name: 'Aminata Conteh',
      email: 'aminata@example.com',
      message: 'I need help with a product.',
      intent,
    }));

    assert.equal(draft.pathname, 'dev@alhajikallon.com');
    assert.equal(draft.searchParams.get('subject'), `Inquiry: ${intent}`);
  }
});

test('keeps idea clarification in the general inbox', () => {
  const draft = new URL(buildContactMailto({
    name: 'User',
    email: 'user@example.com',
    message: 'I have an early idea.',
    intent: 'Clarify an idea',
  }));

  assert.equal(draft.pathname, 'info@alhajikallon.com');
});

test('encodes Unicode and punctuation without losing the original message', () => {
  const message = 'What if we build it?\nLet’s test: 50% of users — first.';
  const draft = new URL(buildContactMailto({
    name: 'José',
    email: 'jose@example.com',
    message,
    intent: 'Something else',
  }));

  assert.equal(draft.searchParams.get('body'), `Name: José\nEmail: jose@example.com\n\n${message}`);
});
