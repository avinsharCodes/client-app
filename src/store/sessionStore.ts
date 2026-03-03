import { create } from 'zustand';

export interface User {
    sub: string;
    email: string;
    roles?: string[];
}

export interface SessionPayload {
    accessToken: string;
    user: User;
    expiresAt: number;
}

export interface SessionState {
    accessToken: string | null;
    user: User | null;
    expiresAt: number | null;
    setSession: (s: SessionPayload) => void;
    clearSession: () => void;
}

export const useSessionStore = create<SessionState>()((set) => ({
    accessToken: null,
    user: null,
    expiresAt: null,
    setSession: (s) => set(s),
    clearSession: () => set({ accessToken: null, user: null, expiresAt: null }),
}));
