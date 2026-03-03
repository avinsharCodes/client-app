import express from 'express';

export const userinfoRouter = express.Router();

userinfoRouter.get('/userinfo', async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'missing_token' });
    }

    try {
        const userinfoResponse = await fetch(`${process.env.AAAS_BASE_URL}/userinfo`, {
            method: 'GET',
            headers: {
                'Authorization': authHeader
            },
        });

        const data = await userinfoResponse.json();

        if (!userinfoResponse.ok) {
            return res.status(userinfoResponse.status).json(data);
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'server_error' });
    }
});
