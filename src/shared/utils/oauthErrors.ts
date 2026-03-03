export const oauthErrors: Record<string, string> = {
    invalid_request: 'The request is missing a required parameter or is malformed.',
    invalid_client: 'Client authentication failed.',
    invalid_grant: 'The provided authorization grant or refresh token is invalid or expired.',
    unauthorized_client: 'The client is not authorized to request an authorization code.',
    unsupported_grant_type: 'The authorization grant type is not supported.',
    invalid_scope: 'The requested scope is invalid, unknown, or malformed.',
    access_denied: 'The resource owner or authorization server denied the request.',
    server_error: 'The authorization server encountered an unexpected condition.',
    account_locked: 'Your account has been temporarily locked due to multiple failed login attempts. Please use the password reset flow to unlock.',
    rate_limited: 'You are submitting requests too quickly. Please wait and try again.',
};
