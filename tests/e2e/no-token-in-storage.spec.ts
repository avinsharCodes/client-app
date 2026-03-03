import { test, expect } from '@playwright/test';

test.describe('No Token in Storage', () => {
    test('Secures secrets entirely in memory and HttpOnly cookies', async ({ page }) => {
        // After an auth sequence is complete
        await page.goto('/dashboard');

        // Evaluate browser storages
        const storage = await page.evaluate(() => ({
            local: Object.keys(localStorage),
            session: Object.keys(sessionStorage),
        }));

        const joined = [...storage.local, ...storage.session].join(' ');

        expect(joined).not.toContain('accessToken');
        expect(joined).not.toContain('refresh');
        expect(joined).not.toContain('code_verifier');
        expect(joined).not.toContain('oauth_state');
    });
});
