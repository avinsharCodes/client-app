import { generatePKCEPair, base64urlEncode } from '../../../shared/utils/pkce';

const AUTHORIZE_URL = import.meta.env.VITE_AAAS_AUTHORIZE_URL || 'http://localhost:5173/authorize';
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID || 'demo-spa-client';
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5174/callback';

export function usePKCE() {
    const initiateOAuth = async () => {
        const { verifier, challenge } = await generatePKCEPair();

        const stateArray = new Uint8Array(32);
        crypto.getRandomValues(stateArray);
        const state = base64urlEncode(stateArray);

        sessionStorage.setItem('code_verifier', verifier);
        sessionStorage.setItem('oauth_state', state);

        const url = new URL(AUTHORIZE_URL);
        url.searchParams.set('response_type', 'code');
        url.searchParams.set('client_id', CLIENT_ID);
        url.searchParams.set('redirect_uri', REDIRECT_URI);
        url.searchParams.set('code_challenge', challenge);
        url.searchParams.set('code_challenge_method', 'S256');
        url.searchParams.set('state', state);
        url.searchParams.set('scope', 'openid profile email');

        window.location.href = url.toString();
    };

    return { initiateOAuth };
}
