import { test, expect } from '@playwright/test';

test('dashboard page renders', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('RiverVision')).toBeVisible();
  await expect(page.getByText('江视觉数据大屏')).toBeVisible();
  await expect(page.getByText('核心指标')).toBeVisible();
});
