import express from 'express';

export const logoutRouter = express.Router();

logoutRouter.post('/logout', async (req, res) => {
    res.clearCookie('refresh_token', { path: '/bff' });

    // Optionally proxy to /revoke here if AaaS supports token revocation

    res.status(200).json({ message: 'logout_success' });
});
