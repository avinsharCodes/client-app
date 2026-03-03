import { Navigate } from 'react-router';
import { Button } from '../shared/components/ui/button';
import { usePKCE } from '../features/demo/hooks/usePKCE';
import { useSessionStore } from '../store/sessionStore';

export function HomePage() {
    const { accessToken } = useSessionStore();
    const { initiateOAuth } = usePKCE();

    if (accessToken) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-xl shadow-lg border border-border">
                <div className="text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-brand-900">Demo SPA</h1>
                    <p className="mt-2 text-muted-foreground">
                        AaaS PKCE Reference Client
                    </p>
                </div>
                <div className="mt-8">
                    <Button
                        className="w-full h-12 text-md font-medium"
                        onClick={() => initiateOAuth()}
                    >
                        Sign In with AaaS
                    </Button>
                </div>
            </div>
        </div>
    );
}
