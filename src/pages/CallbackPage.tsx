import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useSessionStore } from '../store/sessionStore';
import { oauthErrors } from '../shared/utils/oauthErrors';
import { Spinner } from '../shared/components/ui/Spinner';
import { useToast } from '../shared/hooks/useToast';
import { bffApi } from '../features/demo/services/bff.api';

export function CallbackPage() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const { setSession } = useSessionStore();
    const { error: toastError } = useToast();

    const code = params.get('code');
    const state = params.get('state');
    const error = params.get('error');

    const processed = useRef(false);

    useEffect(() => {
        if (processed.current) return;
        processed.current = true;

        // Step 2: Check ?error= FIRST
        if (error) {
            toastError(oauthErrors[error] || oauthErrors.server_error);
            return;
        }

        // Step 3: Validate URL state === sessionStorage
        const savedState = sessionStorage.getItem('oauth_state');
        if (state !== savedState) {
            toastError('Invalid session state');
            return;
        }

        // Step 4: Read code_verifier
        const codeVerifier = sessionStorage.getItem('code_verifier');

        // Step 5: Immediately delete both keys after reading
        sessionStorage.removeItem('code_verifier');
        sessionStorage.removeItem('oauth_state');

        if (!code || !codeVerifier) {
            toastError('Missing authorization code or verifier');
            return;
        }

        // Step 6 & 7: Show spinner implicitly inside the render while calling bffApi
        bffApi.tokenExchange(code, codeVerifier)
            .then((data) => {
                setSession({
                    accessToken: data.accessToken,
                    user: data.user,
                    expiresAt: data.expiresAt
                });
                navigate('/dashboard', { replace: true });
            })
            .catch((err) => {
                // Step 8: On BFF error, show error via useToast. Do not navigate.
                toastError(err.description || err.message || 'Token exchange failed');
            });
    }, [code, state, error, navigate, setSession, toastError]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center space-y-4">
                <Spinner size="lg" />
                <p className="text-muted-foreground">Completing sign in...</p>
            </div>
        </div>
    );
}
