/**
 * Cycle a disclosed navigation's logical order even when its links are portalled
 * away from the trigger in DOM order. Returns whether the event was handled.
 * @param {KeyboardEvent} event
 * @param {HTMLElement[]} controls
 * @param {Element | null} activeElement
 */
export function cycleNavigationFocus(event, controls, activeElement) {
  if (event.key !== 'Tab' || controls.length === 0) return false;
  const current = controls.findIndex((control) => control === activeElement);
  const next = current < 0
    ? (event.shiftKey ? controls.length - 1 : 0)
    : (current + (event.shiftKey ? -1 : 1) + controls.length) % controls.length;
  event.preventDefault();
  controls[next].focus();
  return true;
}
