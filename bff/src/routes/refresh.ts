import express from 'express';

export const refreshRouter = express.Router();

refreshRouter.post('/token/refresh', async (req, res) => {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
        return res.status(401).json({ error: 'no_refresh_token' });
    }

    try {
        const tokenResponse = await fetch(`${process.env.AAAS_BASE_URL}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token,
                client_id: process.env.AAAS_CLIENT_ID || '',
                client_secret: process.env.AAAS_CLIENT_SECRET || '',
            }),
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
            if (data.error === 'invalid_grant') {
                res.clearCookie('refresh_token', { path: '/bff' });
            }
            return res.status(tokenResponse.status).json(data);
        }

        const { access_token, refresh_token: new_rt, expires_in } = data;

        if (new_rt) {
            res.cookie('refresh_token', new_rt, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
                path: '/bff',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
        }

        res.json({
            accessToken: access_token,
            expiresAt: Date.now() + (expires_in * 1000)
        });
    } catch (error) {
        res.status(500).json({ error: 'server_error' });
    }
});
