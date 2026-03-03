import { Navigate } from 'react-router';
import { useSessionStore } from '../../store/sessionStore';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { accessToken } = useSessionStore();

    if (!accessToken) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
