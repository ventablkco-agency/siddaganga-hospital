import { test, expect } from '@playwright/test';

const home = 'http://127.0.0.1:4321/';

test('homepage motion initializes without runtime errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(home, { waitUntil: 'networkidle' });
  await expect(page.locator('.hero')).toBeVisible();
  const mode = await page.locator('html').evaluate((element) => ({
    full: element.classList.contains('motion-full'),
    lite: element.classList.contains('motion-lite'),
    reduced: element.classList.contains('motion-reduced'),
  }));
  expect(mode.full || mode.lite).toBeTruthy();
  expect(mode.reduced).toBeFalsy();
  expect(errors).toEqual([]);
});

test('reduced-motion preference disables the motion layer', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(home, { waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveClass(/motion-reduced/);
  await expect(page.locator('.medical-ticker__track')).toHaveCSS('animation-name', 'none');
});

test('gallery and doctor controls still update active content', async ({ page }) => {
  await page.goto(home, { waitUntil: 'networkidle' });
  await page.locator('[data-gallery-next]').click();
  await expect(page.locator('[data-gallery-title]')).toHaveText('Hospital exterior');
  const stage = page.locator('[data-depth-carousel]');
  await stage.focus();
  await stage.press('ArrowRight');
  await expect(page.locator('[data-depth-card][data-index="1"]')).toHaveAttribute('aria-current', 'true');
  await expect(page.locator('[data-depth-card][data-index="0"]')).toHaveAttribute('aria-hidden', 'true');
});
