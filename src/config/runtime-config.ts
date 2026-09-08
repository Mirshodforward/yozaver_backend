type Environment = Record<string, string | undefined>;
function origin(value: string, name: string, production: boolean) {
  try {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password ||
      url.hostname.includes('*') ||
      url.pathname !== '/' ||
      url.search ||
      url.hash ||
      (production && url.protocol !== 'https:')
    )
      throw new Error();
    return url.origin;
  } catch {
    throw new Error(
      `${name} must be a ${production ? 'HTTPS' : 'HTTP(S)'} origin without a path.`,
    );
  }
}
export function loadRuntimeConfig(env: Environment = process.env) {
  const production = env.NODE_ENV === 'production';
  const port = Number(env.PORT || 4000);
  if (!Number.isInteger(port) || port < 1 || port > 65535)
    throw new Error('PORT must be between 1 and 65535.');
  if (
    !env.DATABASE_URL?.startsWith('postgresql://') &&
    !env.DATABASE_URL?.startsWith('postgres://')
  )
    throw new Error('DATABASE_URL must be a PostgreSQL connection URL.');
  if (
    !env.JWT_SECRET ||
    (production &&
      (env.JWT_SECRET.length < 32 ||
        /change.me|replace.me/i.test(env.JWT_SECRET)))
  )
    throw new Error(
      'JWT_SECRET must be set; production requires at least 32 random characters.',
    );
  if (production && !env.FRONTEND_URL)
    throw new Error('FRONTEND_URL is required in production.');
  const frontendUrl = origin(
    env.FRONTEND_URL?.trim() || 'http://localhost:3000',
    'FRONTEND_URL',
    production,
  );
  const corsOrigins = [
    ...new Set([
      frontendUrl,
      ...(env.CORS_ORIGINS || '')
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean)
        .map((v) => origin(v, 'CORS_ORIGINS', production)),
    ]),
  ];
  if (Boolean(env.GOOGLE_CLIENT_ID) !== Boolean(env.GOOGLE_CLIENT_SECRET))
    throw new Error(
      'Set both GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, or leave both empty.',
    );
  if (env.GOOGLE_CLIENT_ID) {
    try {
      const callback = new URL(env.GOOGLE_CALLBACK_URL || '');
      if (
        !['http:', 'https:'].includes(callback.protocol) ||
        (production && callback.protocol !== 'https:') ||
        callback.username ||
        callback.password ||
        callback.pathname !== '/auth/google/callback' ||
        callback.search ||
        callback.hash
      )
        throw new Error();
    } catch {
      throw new Error(
        'GOOGLE_CALLBACK_URL must point to /auth/google/callback on the API origin.',
      );
    }
  }
  return {
    port,
    frontendUrl,
    corsOrigins,
    production,
    swagger:
      env.ENABLE_SWAGGER === 'true' ||
      (!production && env.ENABLE_SWAGGER !== 'false'),
  };
}
