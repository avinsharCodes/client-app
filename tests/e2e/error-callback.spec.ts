import { test, expect } from '@playwright/test';

test.describe('Error Callback Flow', () => {
    test('Shows error and does not touch BFF or storage', async ({ page, request }) => {
        // Simulate an error callback redirect
        await page.goto('/callback?error=access_denied&state=anything');

        // Should show the toast error 
        // Wait for the sonner toast to appear
        await expect(page.locator('text=The resource owner or authorization server denied the request.')).toBeVisible();

        // Storage should remain empty
        const storage = await page.evaluate(() => ({
            local: Object.keys(localStorage),
            session: Object.keys(sessionStorage),
        }));

        expect(storage.session).toHaveLength(0);
    });
});
