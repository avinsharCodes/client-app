import { test, expect } from '@playwright/test';

test.describe('CSRF Protection', () => {
    test('State mismatch aborts flow', async ({ page }) => {
        // Pre-seed storage
        await page.goto('/');
        await page.evaluate(() => {
            sessionStorage.setItem('oauth_state', 'correct_state');
            sessionStorage.setItem('code_verifier', 'secret_verifier');
        });

        // Navigate with wrong state
        await page.goto('/callback?code=mock_code&state=wrong_state');

        // Should show error
        await expect(page.locator('text=Invalid session state')).toBeVisible();

        // Assess that storage is wiped synchronously even on abort
        const verifier = await page.evaluate(() => sessionStorage.getItem('code_verifier'));
        const state = await page.evaluate(() => sessionStorage.getItem('oauth_state'));

        expect(verifier).toBeNull();
        expect(state).toBeNull();
    });
});
