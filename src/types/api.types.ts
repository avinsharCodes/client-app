export class OAuthApiError extends Error {
    public readonly code: string;
    public readonly description: string;
    public readonly status: number;

    constructor(
        code: string,
        description: string,
        status: number
    ) {
        super(description);
        this.name = 'OAuthApiError';
        this.code = code;
        this.description = description;
        this.status = status;
    }
}

export interface TokenResponse {
    accessToken: string;
    user: {
        sub: string;
        email: string;
        roles?: string[];
    };
    expiresAt: number;
}
