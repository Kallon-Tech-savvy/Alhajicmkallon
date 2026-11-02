import test from 'node:test';
import assert from 'node:assert/strict';
import { cycleNavigationFocus } from '../src/lib/navigation-focus.mjs';

function fixture() {
  let focused;
  let prevented = false;
  const controls = ['close', 'first-link', 'last-link'].map((name) => ({ name, focus() { focused = name; } }));
  return { controls, run(active, shiftKey = false, key = 'Tab', list = controls) {
    const handled = cycleNavigationFocus({ key, shiftKey, preventDefault() { prevented = true; } }, list, active);
    return { focused, prevented, handled };
  } };
}

test('Shift+Tab from the first portalled link reaches Close instead of the page behind', () => {
  const menu = fixture();
  assert.deepEqual(menu.run(menu.controls[1], true), { focused: 'close', prevented: true, handled: true });
});

test('Tab from Close reaches the first portalled link', () => {
  const menu = fixture();
  assert.equal(menu.run(menu.controls[0]).focused, 'first-link');
});

test('both ends wrap within the navigation controls', () => {
  let menu = fixture();
  assert.equal(menu.run(menu.controls[2]).focused, 'close');
  menu = fixture();
  assert.equal(menu.run(menu.controls[0], true).focused, 'last-link');
});

test('unexpected background focus returns to the navigation in either direction', () => {
  let menu = fixture();
  assert.equal(menu.run(null).focused, 'close');
  menu = fixture();
  assert.equal(menu.run(null, true).focused, 'last-link');
});

test('non-Tab keys and empty controls keep their normal behaviour', () => {
  let menu = fixture();
  assert.deepEqual(menu.run(null, false, 'Escape'), { focused: undefined, prevented: false, handled: false });
  menu = fixture();
  assert.deepEqual(menu.run(null, false, 'Tab', []), { focused: undefined, prevented: false, handled: false });
});
