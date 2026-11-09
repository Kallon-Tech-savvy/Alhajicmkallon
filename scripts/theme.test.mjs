import assert from 'node:assert/strict';
import test from 'node:test';
import vm from 'node:vm';
import { THEME_BOOTSTRAP, resolveTheme } from '../src/lib/theme.mjs';

for (const dark of [false, true]) for (const stored of [null, 'system', 'light', 'dark', 'invalid']) {
  test(`pre-paint theme: stored ${stored}, system dark ${dark}`, () => {
    const root = { dataset: {} };
    vm.runInNewContext(THEME_BOOTSTRAP, { document: { documentElement: root }, localStorage: { getItem: () => stored }, matchMedia: () => ({ matches: dark }) });
    assert.equal(root.dataset.theme, stored === 'light' ? 'light' : stored === 'dark' ? 'dark' : dark ? 'dark' : 'light');
    assert.equal(root.dataset.theme, resolveTheme(stored, dark));
  });
}
test('blocked storage still follows system preference', () => {
  const root = { dataset: {} };
  vm.runInNewContext(THEME_BOOTSTRAP, { document: { documentElement: root }, localStorage: { getItem() { throw new Error('Blocked'); } }, matchMedia: () => ({ matches: true }) });
  assert.equal(root.dataset.theme, 'dark');
});
