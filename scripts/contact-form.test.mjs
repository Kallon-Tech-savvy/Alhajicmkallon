import test from 'node:test';
import assert from 'node:assert/strict';
import { buildContactMailto } from '../src/lib/contact-form.mjs';

test('builds an email draft with the selected intent and all form values', () => {
  const draft = new URL(buildContactMailto({
    name: 'Aminata Conteh',
    email: 'aminata@example.com',
    message: 'I want to test a product idea.',
    intent: 'Clarify a product idea',
  }));

  assert.equal(draft.protocol, 'mailto:');
  assert.equal(draft.pathname, 'hello@alhajikallon.dev');
  assert.equal(draft.searchParams.get('subject'), 'Inquiry: Clarify a product idea');
  assert.equal(
    draft.searchParams.get('body'),
    'Name: Aminata Conteh\nEmail: aminata@example.com\n\nI want to test a product idea.',
  );
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

test('uses a general inquiry subject when no intent was selected', () => {
  const draft = new URL(buildContactMailto({
    name: 'User',
    email: 'user@example.com',
    message: 'Hello',
  }));

  assert.equal(draft.searchParams.get('subject'), 'Inquiry: General');
});
