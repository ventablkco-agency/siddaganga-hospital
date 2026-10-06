import { test, expect } from '@playwright/test';
import { visualQaConfig } from '../visual-qa.config.mjs';

const baseURL = process.env.VISUAL_QA_BASE_URL ?? 'http://127.0.0.1:4321';

for (const route of visualQaConfig.routes) {
  for (const viewport of visualQaConfig.viewports) {
    test(`responsive visual QA — ${route.name} — ${viewport.name}`, async ({ page }, testInfo) => {
      const pageErrors = [];
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(new URL(route.path, baseURL).toString(), { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts?.ready);
      await page.waitForTimeout(250);

      const layout = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') ?? null,
        htmlLang: document.documentElement.getAttribute('lang') ?? null,
        title: document.title,
      }));

      expect(pageErrors, 'page must not throw runtime errors').toEqual([]);
      expect(layout.documentWidth, 'page must not horizontally overflow').toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(layout.bodyWidth, 'body must not horizontally overflow').toBeLessThanOrEqual(layout.viewportWidth + 1);
      expect(layout.viewportMeta, 'page must define a responsive viewport').toBeTruthy();
      expect(layout.htmlLang, 'html must define a language').toBeTruthy();
      expect(layout.title, 'page must define a document title').toBeTruthy();

      const brokenImages = await page.locator('img').evaluateAll((images) =>
        images
          .filter((image) => image.getAttribute('src') && (!image.complete || image.naturalWidth === 0))
          .map((image) => image.getAttribute('src')),
      );
      expect(brokenImages, 'images must finish loading successfully').toEqual([]);

      const screenshotName = `${route.name}-${viewport.name}.png`;
      await page.screenshot({
        path: testInfo.outputPath(screenshotName),
        fullPage: false,
        animations: 'disabled',
        scale: 'css',
      });

      if (visualQaConfig.fullPageViewports.has(viewport.name)) {
        await page.screenshot({
          path: testInfo.outputPath(`${route.name}-full-${viewport.name}.png`),
          fullPage: true,
          animations: 'disabled',
          scale: 'css',
        });
      }

      for (const focus of visualQaConfig.focusSelectors) {
        const locator = page.locator(focus.selector).first();
        await expect(locator, `${focus.name} must exist`).toBeVisible();
        await locator.screenshot({
          path: testInfo.outputPath(`${route.name}-${focus.name}-${viewport.name}.png`),
          animations: 'disabled',
          scale: 'css',
        });
      }

      if (visualQaConfig.visualRegression) {
        await expect(page).toHaveScreenshot(screenshotName, {
          fullPage: false,
          animations: 'disabled',
          scale: 'css',
        });
      }
    });
  }
}
