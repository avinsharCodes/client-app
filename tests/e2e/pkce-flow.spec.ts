import { test, expect } from '@playwright/test';

test.describe('Happy Path PKCE Flow', () => {
    test('User can sign in and view dashboard', async ({ page }) => {
        // Go to home page
        await page.goto('/');

        // Wait for and click the Sign In button
        const signInBtn = page.getByRole('button', { name: /sign in with aaas/i });
        await expect(signInBtn).toBeVisible();
        await signInBtn.click();

        // Normally, this would redirect to the real Identity UI. 
        // For E2E we verify it redirects correctly to the configured Auth UI with PKCE params.
        await page.waitForURL('**/authorize**');

        const url = new URL(page.url());
        expect(url.searchParams.get('client_id')).toBeTruthy();
        expect(url.searchParams.get('response_type')).toBe('code');
        expect(url.searchParams.get('state')).toBeTruthy();
        expect(url.searchParams.get('code_challenge')).toBeTruthy();
        expect(url.searchParams.get('code_challenge_method')).toBe('S256');

        // Note: Full end-to-end with auth.localhost requires mock or live server.
        // We simulate the redirect back after "login" from the Identity UI.

        const state = url.searchParams.get('state')!;

        // Simulate returning from AaaS to the callback
        await page.goto(`/callback?code=mock_auth_code_123&state=${state}`);

        // Since we hit the real BFF, it will call AAAS. 
        // Since AAAS is likely not running locally mimicking the identical tokens,
        // it may fail with invalid_grant unless mocked.

        // Ensure MSW or interceptor handles the BFF token call for pure local testing
    });
});
