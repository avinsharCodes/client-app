import { Navigate } from 'react-router';
import { useSessionStore } from '../../../store/sessionStore';
import { useSilentRefresh } from '../hooks/useSilentRefresh';
import type { ReactNode } from 'react';

export function ProtectedRoute({ children }: { children: ReactNode }) {
    const accessToken = useSessionStore((state) => state.accessToken);
    useSilentRefresh();

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
