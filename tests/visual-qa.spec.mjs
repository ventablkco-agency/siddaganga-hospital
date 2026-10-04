import { test, expect } from '@playwright/test';

const viewports = [
  { name: '320x844', width: 320, height: 844 },
  { name: '375x812', width: 375, height: 812 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x900', width: 1024, height: 900 },
  { name: '1440x900', width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`responsive visual QA — ${viewport.name}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(250);

    const layout = await page.evaluate(() => ({
      viewportWidth: window.innerWidth,
      documentWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      overflowX: getComputedStyle(document.documentElement).overflowX,
    }));

    expect(layout.documentWidth, 'page must not horizontally overflow').toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.bodyWidth, 'body must not horizontally overflow').toBeLessThanOrEqual(layout.viewportWidth + 1);
    expect(layout.overflowX, 'root overflow-x should not be forced to scroll').not.toBe('scroll');

    await page.screenshot({
      path: testInfo.outputPath(`homepage-${viewport.name}.png`),
      fullPage: false,
      animations: 'disabled',
      scale: 'css',
    });

    if (viewport.name === '375x812' || viewport.name === '1440x900') {
      await page.screenshot({
        path: testInfo.outputPath(`homepage-full-${viewport.name}.png`),
        fullPage: true,
        animations: 'disabled',
        scale: 'css',
      });
    }
  });
}
