import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './project-root/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['allure-playwright'], ['html']],
  use: {
    trace: 'on-first-retry',
    ...devices['Desktop Chrome'], // нужно за UI тестовете
  },
});