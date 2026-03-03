import { describe, it, expect, beforeEach } from 'vitest';
import { useSessionStore } from './sessionStore';

describe('sessionStore', () => {
    beforeEach(() => {
        localStorage.clear();
        useSessionStore.getState().clearSession();
    });

    it('should store session in memory but not in localStorage', () => {
        useSessionStore.getState().setSession({
            accessToken: 'test-token',
            user: { sub: '123', email: 'test@example.com' },
            expiresAt: Date.now() + 3600000,
        });

        const state = useSessionStore.getState();
        expect(state.accessToken).toBe('test-token');

        // Check localStorage (no persist middleware used)
        expect(localStorage.getItem('sessionStore') || localStorage.length).toBeFalsy();
    });
});
