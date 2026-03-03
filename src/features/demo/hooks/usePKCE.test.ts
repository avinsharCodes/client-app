import { describe, it, expect, beforeEach } from 'vitest';
import { usePKCE } from './usePKCE';

describe('usePKCE', () => {
    beforeEach(() => {
        sessionStorage.clear();
        Object.defineProperty(window, 'location', {
            value: { href: '' },
            writable: true,
        });
    });

    it('initiateOAuth coordinates storage and redirect', async () => {
        const { initiateOAuth } = usePKCE();
        await initiateOAuth();

        const verifier = sessionStorage.getItem('code_verifier');
        const state = sessionStorage.getItem('oauth_state');

        expect(verifier).toBeTruthy();
        expect(state).toBeTruthy();

        const url = new URL(window.location.href);
        expect(url.searchParams.get('state')).toBe(state);
        expect(url.searchParams.get('code_challenge')).toBeTruthy();
        expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    });

    it('generates different verifiers on subsequent calls', async () => {
        const { initiateOAuth } = usePKCE();

        await initiateOAuth();
        const verifier1 = sessionStorage.getItem('code_verifier');

        await initiateOAuth();
        const verifier2 = sessionStorage.getItem('code_verifier');

        expect(verifier1).not.toBe(verifier2);
    });
});
