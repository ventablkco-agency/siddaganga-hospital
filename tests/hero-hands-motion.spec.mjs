import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'desktop', width: 1440, height: 900, scrollY: 300 },
  { name: 'mobile', width: 390, height: 844, scrollY: 300 },
];

for (const viewport of viewports) {
  test(`hero-only hand separation follows scroll on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/', { waitUntil: 'networkidle' });

    const patient = page.locator('.patient-hand');
    const clinician = page.locator('.clinician-hand');
    await expect(patient).toBeVisible();
    await expect(clinician).toBeVisible();

    const readX = (element) =>
      element.evaluate((node) => new DOMMatrixReadOnly(getComputedStyle(node).transform).m41);

    const patientStart = await readX(patient);
    const clinicianStart = await readX(clinician);

    await page.evaluate((scrollY) => window.scrollTo({ top: scrollY, behavior: 'instant' }), viewport.scrollY);

    await expect.poll(() => readX(patient), { timeout: 6000 }).toBeLessThan(patientStart - 1);
    await expect.poll(() => readX(clinician), { timeout: 6000 }).toBeGreaterThan(clinicianStart + 1);

    // Copy and supporting hero UI must not receive scroll transforms.
    for (const selector of ['.hero-copy', '.hero-right-copy', '.care-panel', '.service-pills']) {
      await expect(page.locator(selector).first()).toHaveCSS('transform', 'none');
    }

    // Other homepage sections remain free of automatic reveal/marquee motion.
    await expect(page.locator('.section-two__text-reveal')).toHaveCSS('transform', 'none');
    await expect(page.locator('.medical-ticker__track')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.retro-grid__plane').first()).toHaveCSS('animation-name', 'none');
  });
}
