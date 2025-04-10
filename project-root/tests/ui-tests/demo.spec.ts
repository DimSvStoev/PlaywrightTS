import { test, expect } from '@playwright/test';

test('Demo test loads example.com', async ({ page }) => {
  await page.goto('https://example.com');
  await expect(page).toHaveTitle(/Example Domain/);
});