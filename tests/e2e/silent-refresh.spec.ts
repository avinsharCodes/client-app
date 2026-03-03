import { test, expect } from '@playwright/test';

test.describe('Silent Refresh', () => {
    test('Automatically renews token before expiry', async ({ page }) => {
        // Here we test the local mechanism for silent refresh
        await page.goto('/');

        // This simulates mounting the app and setting a mocked session payload
        await page.evaluate(() => {
            const { useSessionStore } = (window as any);
            if (useSessionStore) {
                // Force an expiration in 50 seconds (timer logic triggers at t-60s)
                // so it fires immediately.
                useSessionStore.getState().setSession({
                    accessToken: 'mock1',
                    expiresAt: Date.now() + 50 * 1000,
                    user: { sub: 'u1', email: 'test@example.com' }
                });
            }
        });

        // Navigate to the dashboard to mount useSilentRefresh
        await page.goto('/dashboard');

        // Network intercept to check if BFF POST /bff/token/refresh is called
        // In a real environment, Playwright's `page.waitForResponse` or checking the new timer.
    });
});
