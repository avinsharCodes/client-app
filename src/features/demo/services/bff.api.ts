import { OAuthApiError, type TokenResponse } from '../../../types/api.types';

const BASE = import.meta.env.VITE_BFF_BASE_URL || '/bff';

async function bffRequest<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', ...init?.headers },
        ...init,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new OAuthApiError(
            body.error || 'unknown_error',
            body.error_description || 'An unknown error occurred',
            res.status
        );
    }

    if (res.status === 204) return {} as T;
    return res.json() as Promise<T>;
}

export const bffApi = {
    tokenExchange: (code: string, codeVerifier: string) =>
        bffRequest<TokenResponse>('/token', {
            method: 'POST',
            body: JSON.stringify({ code, codeVerifier }),
        }),
    refreshToken: () => bffRequest<TokenResponse>('/token/refresh', { method: 'POST' }),
    getUserInfo: () => bffRequest<any>('/userinfo'),
    logout: () => bffRequest<void>('/logout', { method: 'POST' }),
};
