import type { PlaywrightTestConfig } from '@playwright/test';

const E2E_PORT = Number(process.env.E2E_PORT || 4173);

const config: PlaywrightTestConfig = {
  testDir: './e2e',
  testMatch: /.*\.spec\.ts$/,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: 0,
  use: {
    baseURL: process.env.E2E_BASE_URL || `http://127.0.0.1:${E2E_PORT}`,
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  webServer: {
    command: `npm run dev -- --host --port ${E2E_PORT}`,
    url: `http://127.0.0.1:${E2E_PORT}`,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 60_000,
  },
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
};

export default config;
