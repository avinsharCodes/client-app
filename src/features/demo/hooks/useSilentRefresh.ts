import { useEffect } from 'react';
import { useSessionStore } from '../../../store/sessionStore';
import { bffApi } from '../services/bff.api';

export function useSilentRefresh() {
    const { expiresAt, setSession, clearSession } = useSessionStore();

    useEffect(() => {
        if (!expiresAt) return;

        const msUntilRefresh = Math.max((expiresAt - Date.now()) - 60_000, 0);

        const timerId = setTimeout(async () => {
            try {
                const { accessToken, expiresAt: newExpiry } = await bffApi.refreshToken();
                const user = useSessionStore.getState().user;
                if (user) {
                    setSession({ accessToken, user, expiresAt: newExpiry });
                } else {
                    clearSession();
                }
            } catch {
                clearSession();
            }
        }, msUntilRefresh);

        return () => clearTimeout(timerId);
    }, [expiresAt, setSession, clearSession]);
}
