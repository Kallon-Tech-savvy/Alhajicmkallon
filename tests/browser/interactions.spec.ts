import { test, expect } from '@playwright/test';

test('search returns a published guide and restores focus when dismissed', async ({ page }) => {
  await page.goto('/');
  const trigger = page.getByRole('button', { name: 'Search (Ctrl or Command K)', exact: true });
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Search this website' });
  const search = dialog.getByRole('searchbox');
  await expect(search).toBeFocused();
  await search.fill('HTTP');
  await expect(
    dialog.getByRole('link', { name: /Make HTTP responses mean something/ }),
  ).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
});

test('chat preserves failed input, retries once, clears and stops a pending reply', async ({
  page,
}) => {
  let calls = 0;
  await page.route('**/api/chat', async (route) => {
    calls++;
    if (calls === 1) return route.fulfill({ status: 503, json: { error: 'Unavailable' } });
    if (calls === 2)
      return route.fulfill({ json: { reply: 'A useful answer about the portfolio.' } });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await route
      .fulfill({ json: { reply: 'Late answer that must not be displayed.' } })
      .catch(() => {});
  });
  await page.goto('/');
  const launcher = page.getByRole('button', { name: 'Ask a question about Alhaji', exact: true });
  await launcher.click();
  const dialog = page.getByRole('dialog', { name: 'Ask about Alhaji' });
  const input = dialog.getByRole('textbox', { name: 'Your message' });
  await expect(input).toBeFocused();
  await input.fill('Tell me about the work');
  await input.press('Enter');
  await expect(dialog.getByRole('alert')).toBeVisible();
  await expect(input).toHaveValue('Tell me about the work');
  await dialog.getByRole('button', { name: 'Retry question' }).click();
  await expect(dialog.getByRole('log')).toContainText('A useful answer about the portfolio.');
  await expect(
    dialog.getByRole('log').getByText('Tell me about the work', { exact: true }),
  ).toHaveCount(1);
  await dialog.getByRole('button', { name: 'Clear chat' }).click();
  await expect(dialog.getByRole('log')).not.toContainText('A useful answer');
  await input.fill('Keep my question');
  await input.press('Enter');
  await dialog.getByRole('button', { name: 'Stop reply' }).click();
  await expect(input).toHaveValue('Keep my question');
  await expect(dialog.getByRole('alert')).toContainText('Reply stopped');
  expect(calls).toBe(3);
  await expect(dialog.getByRole('log')).not.toContainText('Late answer');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(launcher).toBeFocused();
});

test('mobile navigation contains focus and closes after selecting a destination', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const open = page.getByRole('button', { name: 'Open navigation menu' });
  await open.click();
  const menu = page.getByRole('region', { name: 'Mobile navigation' });
  await expect(menu).toBeVisible();
  const home = menu.getByRole('link', { name: /^Home/ });
  await expect(home).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(menu.getByRole('combobox', { name: 'Colour theme' })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(page.getByRole('button', { name: 'Close navigation menu' })).toBeFocused();
  await menu.getByRole('link', { name: /^About/ }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(menu).not.toBeVisible();
});

test('contact email fallback preserves the draft and does not claim delivery', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  // Never send a real enquiry, even if a local build has Formspree configured.
  await page.route('https://formspree.io/**', (route) =>
    route.fulfill({ status: 503, json: { error: 'Test outage' } }),
  );
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Improve a product', exact: true }).click();
  await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Test Visitor');
  await page.getByRole('textbox', { name: 'Your email', exact: true }).fill('visitor@example.com');
  const message = page.getByRole('textbox', { name: 'What would you like to change or achieve?' });
  await message.fill('A local test draft.');
  await page.getByRole('button', { name: 'Send message', exact: true }).click();
  await expect(page.getByRole('status')).toContainText(
    /does not confirm delivery|message was not accepted/,
  );
  await expect(message).toHaveValue('A local test draft.');
  await expect(page.getByRole('heading', { name: 'Message received' })).not.toBeVisible();
  expect(errors).toEqual([]);
});
