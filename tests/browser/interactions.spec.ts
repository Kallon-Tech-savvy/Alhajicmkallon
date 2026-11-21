import { test, expect, type Page } from '@playwright/test';

async function mockTurnstile(page: Page) {
  await page.route(
    'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
    (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/javascript',
        body: `window.turnstile = {
        render: function(el, config) {
          if (config.sitekey !== '0x4AAAAAAGF6eqlDlOmcJvuf' || config.action !== 'contact') {
            throw Error('Unexpected widget configuration');
          }
          config.callback('browser-test-token');
          window.__turnstileTestReady = true;
          return 'contact-test-widget';
        },
        reset: function() {},
        remove: function() {}
      };`,
      }),
  );
}

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
  const launcher = page.getByRole('button', { name: 'Ask about my work', exact: true });
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
  // Simulate the existing widget. Never call Cloudflare or Resend in browser tests.
  await mockTurnstile(page);
  let submittedToken = '';
  await page.route('**/api/contact', (route) => {
    const data = route.request().postDataJSON();
    submittedToken = data.turnstileToken;
    return route.fulfill({ status: 503, json: { error: 'Test outage' } });
  });
  await page.goto('/contact');
  await expect(
    page.getByRole('button', { name: 'Open email draft instead', exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText('You will need to send it yourself.', { exact: false }),
  ).toBeVisible();
  await page.waitForFunction(
    () =>
      (window as typeof window & { __turnstileTestReady?: boolean }).__turnstileTestReady === true,
  );
  const intent = page.getByRole('button', { name: 'Improve a product', exact: true });
  await intent.click();
  await expect(intent).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('textbox', { name: 'Your name (required)', exact: true }).fill('Test Visitor');
  await page.getByRole('textbox', { name: 'Your email (required)', exact: true }).fill('visitor@example.com');
  const message = page.getByRole('textbox', { name: 'What are you trying to achieve?' });
  await message.fill('A local test draft.');
  await page.getByRole('button', { name: /^(Send enquiry|Open email draft)$/ }).click();
  await expect.poll(() => submittedToken).toBe('browser-test-token');
  await expect(page.getByRole('status')).toContainText(
    /preserved|not confirmed|not be confirmed|verification|Delivery is not confirmed|not be accepted/i,
  );
  await expect(message).toHaveValue('A local test draft.');
  await expect(
    page.getByRole('button', { name: 'Open email draft instead', exact: true }),
  ).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Enquiry submitted' })).not.toBeVisible();
  expect(errors).toEqual([]);
});

function contrastRatio(first: string, second: string): number {
  const luminance = (colour: string) => {
    const values = colour
      .match(/[\d.]+/g)!
      .slice(0, 3)
      .map(Number)
      .map((value) => {
        const channel = value / 255;
        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
      });
    return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
  };
  const [low, high] = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
}

for (const { width, scheme } of [
  { width: 320, scheme: 'light' },
  { width: 390, scheme: 'dark' },
  { width: 768, scheme: 'light' },
  { width: 1440, scheme: 'dark' },
] as const) {
  test(`shared layouts fit ${width}px in ${scheme} mode`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: scheme });
    for (const route of ['/', '/work', '/about', '/knowledge', '/writing', '/contact']) {
      await page.goto(route);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `Horizontal overflow on ${route}`).toBeLessThanOrEqual(1);
      await expect(page.locator('html')).toHaveAttribute('data-theme', scheme);
      const masthead = page.getByRole('navigation', { name: 'Primary navigation', exact: true });
      const colours = await masthead.evaluate((element) => ({
        background: getComputedStyle(element).backgroundColor,
        text: getComputedStyle(element.querySelector('.brand-name')!).color,
      }));
      expect(
        contrastRatio(colours.text, colours.background),
        `Masthead text contrast on ${route}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
}

test('reduced motion leaves display content visible without entrance animation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  expect(await heading.evaluate((element) => getComputedStyle(element).animationName)).toBe('none');
  await expect(page.getByRole('link', { name: 'See project case studies', exact: false })).toBeVisible();
});

test('productive overlays remain usable at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/');
  const searchTrigger = page.getByRole('button', { name: 'Search site', exact: true });
  await searchTrigger.click();
  const searchDialog = page.getByRole('dialog', { name: 'Search this website' });
  await expect(searchDialog.getByRole('searchbox')).toBeFocused();
  const searchBounds = (await searchDialog.boundingBox())!;
  expect(searchBounds.x).toBeGreaterThanOrEqual(0);
  expect(searchBounds.x + searchBounds.width).toBeLessThanOrEqual(320);
  await page.keyboard.press('Escape');
  await expect(searchTrigger).toBeFocused();

  await page.getByRole('button', { name: 'Ask about my work', exact: true }).click();
  const chat = page.getByRole('dialog', { name: 'Ask about Alhaji' });
  const input = chat.getByRole('textbox', { name: 'Your message' });
  await expect(input).toBeFocused();
  const bounds = (await chat.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(700);
  await expect(chat.getByRole('button', { name: 'Send message', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(chat).not.toBeVisible();
});

for (const kind of ['search', 'chat'] as const) {
  test(`${kind} responds immediately and stays dismissed while its code downloads`, async ({
    page,
  }) => {
    await page.goto('/');
    const trigger = page.getByRole('button', {
      name: kind === 'chat' ? 'Ask about my work' : 'Search (Ctrl or Command K)',
      exact: true,
    });
    // Wait for hydration, then hold optional JS downloads to simulate a cold connection.
    await expect(trigger).toBeVisible();
    await expect
      .poll(() =>
        trigger.evaluate((element) =>
          Object.keys(element).some((key) => key.startsWith('__reactProps')),
        ),
      )
      .toBe(true);
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    await page.route(/\.(?:m?js)(?:\?.*)?$/, async (route) => {
      await held;
      await route.continue();
    });
    try {
      // DOM click deliberately skips pointer/focus preloading so the cold path is exercised.
      await trigger.evaluate((element: HTMLButtonElement) => element.click());
      const pending = page.getByRole('dialog', { name: `Loading ${kind}` });
      await expect(pending).toBeVisible({ timeout: 1500 });
      await expect(pending.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(pending).not.toBeVisible();
    } finally {
      release();
    }
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await trigger.click();
    await expect(
      page.getByRole('dialog', {
        name: kind === 'chat' ? 'Ask about Alhaji' : 'Search this website',
        exact: true,
      }),
    ).toBeVisible();
  });
}

test('desktop Learn navigates directly and mobile learning shortcuts remain keyboard accessible', async ({
  page,
}) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Primary navigation', exact: true });
  await navigation.getByRole('link', { name: 'Learn', exact: true }).click();
  await expect(page).toHaveURL(/\/knowledge$/);
  await expect(navigation.getByRole('link', { name: 'Learn', exact: true })).toHaveAttribute(
    'aria-current',
    'page',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Open navigation menu' }).click();
  const menu = page.getByRole('region', { name: 'Mobile navigation' });
  await expect(menu.getByRole('link', { name: /Protocol course/ })).not.toBeVisible();
  const paths = menu.locator('summary');
  await paths.focus();
  await paths.press('Tab');
  await expect(menu.getByRole('link', { name: 'Twitter', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(paths).toBeFocused();
  await paths.press('Enter');
  await expect(menu.getByRole('link', { name: /Protocol course/ })).toBeVisible();
  await paths.press('Tab');
  await expect(menu.getByRole('link', { name: /Protocol course/ })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Open navigation menu' })).toBeFocused();
});

test('Work page has its own social metadata, evidence, and only one invitation', async ({
  page,
}) => {
  await page.goto('/work');

  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://alhajikallon.com/work',
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Selected work | Alhaji C.M. Kallon',
  );
  await expect(page.getByRole('heading', { name: 'From problem to product.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse all projects' })).toHaveCount(0);
  await expect(page.locator('.work-evidence')).toHaveCount(2);
  await expect(page.getByText('My role:', { exact: false })).toHaveCount(2);
  await expect(page.getByText('What the evidence says so far:', { exact: false })).toHaveCount(2);
  await expect(page.getByRole('link', { name: 'Describe your project', exact: true })).toBeVisible();
  await expect(page.locator('.footer-invitation')).toHaveCount(0);
});

test('Home retains its selected work heading and clear contact invitation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'A deliberate balance.' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'See project case studies', exact: true })).toHaveAttribute('href', '#work');
  await expect(page.getByRole('link', { name: 'Browse all projects' })).toBeVisible();
  await expect(page.locator('.practice-steps details')).toHaveCount(3);
  await expect(page.getByRole('link', { name: 'Describe your project', exact: true })).toHaveAttribute('href', '/contact');
  await expect(page.getByRole('link', { name: 'Open the contact form', exact: true })).toHaveAttribute('href', '/contact');
  await expect(page.getByRole('link', { name: 'Learn', exact: true })).toHaveCount(2);
});

test('Writing page has verified Substack fallback and no self-linking CTA', async ({ page }) => {
  // The real external feed can fail; the curated article must remain visible.
  await page.goto('/writing');
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    'content',
    'https://alhajikallon.com/writing',
  );
  await expect(
    page.getByText('Sierra Leone’s Salone Pement Switch:', { exact: false }),
  ).toBeVisible();
  await expect(page.locator('a[href="https://alhajicmkallon.substack.com/feed"]')).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Follow on Substack|Read the latest notes/ }),
  ).toBeVisible();
  await expect(page.locator('.footer-invitation')).toHaveCount(0);
  const noteCount = await page.locator('a[href^="/writing/"]').count();
  if (noteCount < 3) {
    await expect(page.getByRole('searchbox', { name: 'Search notes' })).toHaveCount(0);
  }
});

test('About, Contact, Learn and FAQ use their own metadata', async ({ page }) => {
  for (const path of ['/about', '/contact', '/knowledge', '/faq']) {
    await page.goto(path);
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `https://alhajikallon.com${path}`,
    );
  }
  await page.goto('/contact');
  await expect(page.locator('.ui-form-panel')).toBeVisible();
  await expect(page.locator('.footer-invitation')).toHaveCount(0);
  await page.goto('/knowledge');
  await expect(page.getByText('Protocols are the agreed rules', { exact: false })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Suggest a topic' })).toBeVisible();
});

test('contact timeout preserves the draft and restores the email fallback', async ({ page }) => {
  await mockTurnstile(page);
  let posted = false;
  await page.route('**/api/contact', () => {
    posted = true;
  });
  await page.clock.install();
  await page.goto('/contact');
  await page.waitForFunction(
    () =>
      (window as typeof window & { __turnstileTestReady?: boolean }).__turnstileTestReady === true,
  );
  const name = page.getByRole('textbox', { name: 'Your name', exact: true });
  const email = page.getByRole('textbox', { name: 'Your email', exact: true });
  const message = page.getByRole('textbox', { name: 'What are you trying to achieve?' });
  await name.fill('Test Visitor');
  await email.fill('visitor@example.com');
  await message.fill('Preserve this draft after the network stalls.');
  await page.getByRole('button', { name: 'Send enquiry', exact: true }).click();
  await expect.poll(() => posted).toBe(true);
  await expect(message).toBeDisabled();
  await page.clock.runFor(30_001);
  await expect(page.getByRole('status')).toContainText('Delivery could not be confirmed');
  await expect(message).toBeEnabled();
  await expect(message).toHaveValue('Preserve this draft after the network stalls.');
  await expect(name).toHaveValue('Test Visitor');
  await expect(email).toHaveValue('visitor@example.com');
  await expect(
    page.getByRole('button', { name: 'Open email draft instead', exact: true }),
  ).toBeEnabled();
  await expect(page.getByRole('heading', { name: 'Enquiry submitted' })).not.toBeVisible();
});

test('contact acceptance clears the submitted draft and permits a fresh enquiry', async ({
  page,
}) => {
  await mockTurnstile(page);
  await page.route('**/api/contact', (route) => route.fulfill({ json: { ok: true } }));
  await page.goto('/contact');
  await page.waitForFunction(
    () =>
      (window as typeof window & { __turnstileTestReady?: boolean }).__turnstileTestReady === true,
  );
  await page.getByRole('textbox', { name: 'Your name', exact: true }).fill('Test Visitor');
  await page.getByRole('textbox', { name: 'Your email', exact: true }).fill('visitor@example.com');
  await page
    .getByRole('textbox', { name: 'What are you trying to achieve?' })
    .fill('A mocked successful enquiry.');
  await page.getByRole('button', { name: 'Send enquiry', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Enquiry submitted' })).toBeVisible();
  await page.getByRole('button', { name: 'Send Additional Message' }).click();
  await expect(page.getByRole('textbox', { name: 'Your name', exact: true })).toHaveValue('');
  await expect(page.getByRole('textbox', { name: 'What are you trying to achieve?' })).toHaveValue(
    '',
  );
});
