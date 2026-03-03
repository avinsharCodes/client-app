import { http, HttpResponse } from 'msw'

export const handlers = [
    http.post('/bff/token', async ({ request }) => {
        const body = await request.json().catch(() => ({})) as any;

        if (body?.code === 'error-code') {
            return HttpResponse.json(
                { error: 'invalid_grant', error_description: 'Test Error' },
                { status: 400 }
            )
        }

        return HttpResponse.json({
            accessToken: 'mock-access-token',
            expiresAt: Date.now() + 3600000,
            user: { sub: 'mock-user', email: 'user@example.com' }
        })
    }),
]
