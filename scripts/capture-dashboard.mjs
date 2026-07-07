import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const BASE_URL = 'http://127.0.0.1:10001';
const VIEWPORT = { width: 1920, height: 1080 };
const OUTPUT_PATH = path.join(process.cwd(), 'docs/screenshots/dashboard-1920x1080.png');

async function main() {
  const errors = [];

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });
  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });

    await page.getByRole('heading', { name: 'RiverVision' }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByText('江河生态、设备运行与告警信息统一可视化监测').waitFor({ state: 'visible', timeout: 30000 });
    await page.getByRole('heading', { name: '核心指标' }).waitFor({ state: 'visible', timeout: 30000 });
    await page.getByText('告警中心').waitFor({ state: 'visible', timeout: 30000 });
    await page.getByText('实时态势').waitFor({ state: 'visible', timeout: 30000 });

    await page.waitForTimeout(5000);

    await page.screenshot({ path: OUTPUT_PATH, fullPage: false });
    console.log(`Screenshot saved to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }

  if (errors.length > 0) {
    console.error('Console errors detected:');
    for (const err of errors) {
      console.error(` - ${err}`);
    }
    console.error(`Screenshot preserved at ${OUTPUT_PATH}`);
    process.exitCode = 1;
    return;
  }

  console.log('Screenshot completed without console errors.');
}

main();
