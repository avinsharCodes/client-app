import express from 'express';

export const tokenRouter = express.Router();

tokenRouter.post('/token', async (req, res) => {
    const { code, codeVerifier } = req.body;

    try {
        const tokenResponse = await fetch(`${process.env.AAAS_BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                code_verifier: codeVerifier,
                client_id: process.env.AAAS_CLIENT_ID || '',
                client_secret: process.env.AAAS_CLIENT_SECRET || '',
                redirect_uri: process.env.AAAS_REDIRECT_URI || '',
            }),
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
            return res.status(tokenResponse.status).json(data);
        }

        const { access_token, refresh_token, expires_in, id_token } = data;

        // Let's decode ID token blindly just for demo if AaaS returns it, 
        // normally we would parse it properly:
        // Here we just mock the payload for the assignment if needed or parse jwt
        const user = { sub: 'mock-sub', email: 'mock@example.com' };

        // Real logic should use jose / verify the id_token

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            path: '/bff',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.json({
            accessToken: access_token,
            expiresAt: Date.now() + (expires_in * 1000),
            user
        });
    } catch (error) {
        res.status(500).json({ error: 'server_error', error_description: 'BFF encountered an error communicating with AaaS.' });
    }
});
