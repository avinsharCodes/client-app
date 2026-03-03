import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { useSessionStore } from '../store/sessionStore';
import { useSilentRefresh } from '../features/demo/hooks/useSilentRefresh';
import { bffApi } from '../features/demo/services/bff.api';
import { Button } from '../shared/components/ui/button';
import { TokenCountdown } from '../shared/components/ui/TokenCountdown';

export function DashboardPage() {
    useSilentRefresh();
    const navigate = useNavigate();
    const { user, expiresAt, clearSession } = useSessionStore();

    const { data: userInfo, isLoading } = useQuery({
        queryKey: ['userinfo'],
        queryFn: () => bffApi.getUserInfo(),
        retry: 1
    });

    const handleSignOut = async () => {
        try {
            await bffApi.logout();
        } finally {
            clearSession();
            navigate('/', { replace: true });
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
                <h1 className="text-3xl font-bold text-brand-900">Dashboard</h1>
                <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">Session Status</h2>
                <div className="flex gap-4 items-center">
                    <span className="text-muted-foreground">Time until expiry:</span>
                    {expiresAt && <TokenCountdown expiresAt={expiresAt} />}
                </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h2 className="text-xl font-semibold">User context</h2>
                {isLoading ? (
                    <p className="text-muted-foreground animate-pulse">Loading secure profile...</p>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                                <p>{user?.email || userInfo?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Scopes</h3>
                                <p>{userInfo?.scope || 'openid profile email'}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Granted Roles</h3>
                            <div className="flex gap-2 items-center flex-wrap">
                                {user?.roles?.map(role => (
                                    <span key={role} className="px-2.5 py-0.5 bg-brand-50 text-brand-600 rounded text-xs font-semibold border border-brand-100">{role}</span>
                                )) || <span className="text-sm text-muted-foreground">No explicit roles assigned</span>}
                            </div>
                        </div>
                        <details className="mt-4">
                            <summary className="text-sm font-medium text-brand-600 cursor-pointer">View Raw UserInfo Response</summary>
                            <pre className="bg-muted p-4 rounded-md overflow-auto text-xs mt-2 border border-border">
                                {JSON.stringify(userInfo, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </div>
    );
}
