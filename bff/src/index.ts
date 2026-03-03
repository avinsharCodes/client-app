import express from 'express';
import cookieParser from 'cookie-parser';
import { tokenRouter } from './routes/token';
import { refreshRouter } from './routes/refresh';
import { userinfoRouter } from './routes/userinfo';
import { logoutRouter } from './routes/logout';

const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' http://localhost:3001; frame-ancestors 'none';"
    );
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
});

app.use('/bff', tokenRouter);
app.use('/bff', refreshRouter);
app.use('/bff', userinfoRouter);
app.use('/bff', logoutRouter);

import path from 'path';

app.get('/bff/health', (req, res) => res.sendStatus(200));

// Serve React SPA statically
const clientBuildPath = path.join(__dirname, '../../dist');
app.use(express.static(clientBuildPath));

app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`BFF listening on port ${PORT}`));
