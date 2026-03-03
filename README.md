# AaaS Demo SPA

This repository contains the **PKCE Reference Client** for the AaaS Identity Platform.

## Architecture
This project demonstrates the **Backend for Frontend (BFF)** pattern. It features two components:
1. `client-app/` - The React Vite SPA (running on port 5174 in dev).
2. `client-app/bff/` - The Node.js Express server acting as a secure proxy and token handler.

### Why use a BFF?
Single Page Applications (SPAs) cannot safely store long-lived credentials like Refresh Tokens, nor can they safely hold the `client_secret` required by robust OAuth 2.0 flows. This application delegates the token generation step to the `/bff` Node.js server. 
- The SPA handles initiating the OAuth flow with PKCE (`src/features/demo/hooks/usePKCE.ts`).
- The BFF receives the Authorization Code, securely exchanges it with the AaaS Backend, and stores the resulting **Refresh Token** in an `HttpOnly`, `SameSite=Strict` cookie, rendering it inaccessible to malicious JavaScript (XSS).
- The SPA only holds the short-lived `accessToken` in-memory.

## Prerequisites
You must have the AaaS Identity UI (`auth.localhost`) and AaaS Backend running.
- Register an OAuth client named `demo-spa-client` with `authorization_code` allowed grant matching the `.env.example`.

## Local Setup
1. Clone the repository and install dependencies: `npm install && cd bff && npm install && cd ..`.
2. Copy `.env.example` to `.env` in both the root folder and the `bff/` folder.
   - Insert a solid 32-byte hex for `COOKIE_SECRET` in `bff/.env`.
   - Never commit `AAAS_CLIENT_SECRET`.
3. Run both servers concurrently:
```bash
npm run dev
```
Navigate to `http://localhost:5174/`.

## Integration Guidance (For Partners)
When copying this pattern to your own repository:
- Copy `src/shared/utils/pkce.ts` verbatim to execute proper SHA-256 S256 code challenge generation.
- Replicate the exact step sequence in `src/pages/CallbackPage.tsx` — particularly destroying the state variables synchronously whether the operation succeeds or fails.
- Never use `localStorage` for tokens or Zustand `persist` middleware on session stores.
- See the AaaS Identity UI Blueprint v3.0 for exact consent contracts.
