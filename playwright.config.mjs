import { defineConfig } from '@playwright/test';

const baseURL = process.env.VISUAL_QA_BASE_URL ?? 'http://127.0.0.1:4321';
const previewCommand = process.env.VISUAL_QA_PREVIEW_COMMAND ?? 'npm run preview -- --host 127.0.0.1 --port 4321';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  globalTimeout: 15 * 60 * 1000,
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  outputDir: 'test-results',
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],
  use: {
    baseURL,
    browserName: 'chromium',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    colorScheme: 'light',
    reducedMotion: 'reduce',
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
  },
  webServer: {
    command: previewCommand,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
