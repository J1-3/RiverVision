import { test, expect } from '@playwright/test';

test('dashboard page renders', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'RiverVision' })).toBeVisible();
  await expect(page.getByText('江河生态、设备运行与告警信息统一可视化监测')).toBeVisible();
  await expect(page.getByRole('heading', { name: '核心指标' })).toBeVisible();
  await expect(page.getByText('告警中心')).toBeVisible();
  await expect(page.getByText('实时态势')).toBeVisible();

  await page.waitForTimeout(5000);

  await page.screenshot({ path: 'test-results/dashboard-screenshot.png', fullPage: true });

  expect(errors).toHaveLength(0);
});
