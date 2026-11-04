import { expect, test } from '@playwright/test';

test('administrator can sign in and navigate the portal', async ({ page }, testInfo) => {
  await page.goto('/login');
  if (testInfo.project.name === 'desktop') {
    await expect(page.getByRole('heading', { name: 'Clear oversight for every doctor and patient.' })).toBeVisible();
    await page.screenshot({ path: 'docs/screenshots/login-desktop.png', fullPage: true });
  }
  await page.getByLabel('Email address').fill(process.env.E2E_ADMIN_EMAIL ?? 'admin@doctortracker.local');
  await page.getByLabel('Password').fill(process.env.E2E_ADMIN_PASSWORD ?? 'DoctorTracker!2026#Admin');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.waitForTimeout(2_000);
  if (testInfo.project.name === 'desktop') {
    await page.screenshot({ path: 'docs/screenshots/dashboard-desktop.png', fullPage: true });
  }
});
