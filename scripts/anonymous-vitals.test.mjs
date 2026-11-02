import test from 'node:test';
import assert from 'node:assert/strict';
import { parseAnonymousVital, readSmallVitalJson, MAX_VITAL_BYTES } from '../src/lib/anonymous-vitals.mjs';

const valid = { name: 'INP', value: 145, section: 'work', viewport: 'small' };

test('accepts only bounded anonymous measurements', () => {
  assert.deepEqual(parseAnonymousVital(valid), valid);
  assert.deepEqual(parseAnonymousVital({ name: 'CLS', value: 0.08, section: 'home', viewport: 'large' }),
    { name: 'CLS', value: 0.08, section: 'home', viewport: 'large' });
  for (const payload of [
    null, [], 'not a metric',
    { ...valid, value: -1 }, { ...valid, value: Infinity },
    { ...valid, value: '145' }, { ...valid, name: 'not-a-metric' },
    { ...valid, section: '/work?token=secret' }, { ...valid, viewport: 'phone-123' },
    { ...valid, url: '/work/private' }, { ...valid, id: 'unique-page-load' },
    { ...valid, name: 'CLS', value: 1.5 }, { ...valid, value: 120_001 },
  ]) assert.equal(parseAnonymousVital(payload), null);
});

test('small-body reader parses JSON and rejects oversized chunked bodies', async () => {
  assert.deepEqual(await readSmallVitalJson(new Request('http://localhost/', {
    method: 'POST', body: JSON.stringify(valid),
  })), valid);
  await assert.rejects(() => readSmallVitalJson(new Request('http://localhost/', {
    method: 'POST', body: JSON.stringify({ ...valid, padding: 'x'.repeat(MAX_VITAL_BYTES + 1) }),
  })), RangeError);
  await assert.rejects(() => readSmallVitalJson(new Request('http://localhost/', {
    method: 'POST', body: '{oops',
  })), SyntaxError);
});
