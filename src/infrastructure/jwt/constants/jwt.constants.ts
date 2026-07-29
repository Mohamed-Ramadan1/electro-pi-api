export const JWT_CONFIG = Symbol.for('JWT_CONFIG');

export const JWT_ACCESS_TOKEN_TYPE = 'access';

export const JWT_REFRESH_TOKEN_TYPE = 'refresh';

export const JWT_DEFAULT_ACCESS_TTL = '15m';

export const JWT_DEFAULT_REFRESH_TTL = '7d';

export const JWT_DEFAULT_ISSUER = 'noviq-api';

export const JWT_DEFAULT_AUDIENCE = 'noviq-client';

export const JWT_DEV_ACCESS_SECRET = 'noviq-dev-access-token-secret-change-me';

export const JWT_DEV_REFRESH_SECRET =
  'noviq-dev-refresh-token-secret-change-me';
