import { loadRuntimeConfig } from './runtime-config.js';
const production = {
  NODE_ENV: 'production',
  DATABASE_URL: 'postgresql://test:test@db:5432/test',
  JWT_SECRET: 'a'.repeat(64),
  FRONTEND_URL: 'https://yozaver.uz',
};
describe('production configuration', () => {
  it('uses port 4000 and exact allowed origins, with Swagger disabled', () => {
    expect(
      loadRuntimeConfig({
        ...production,
        CORS_ORIGINS: 'https://www.yozaver.uz, https://yozaver.uz',
      }),
    ).toMatchObject({
      port: 4000,
      swagger: false,
      corsOrigins: ['https://yozaver.uz', 'https://www.yozaver.uz'],
    });
  });
  it.each([
    { JWT_SECRET: '' },
    { JWT_SECRET: 'short' },
    { JWT_SECRET: 'change-me'.repeat(8) },
    { FRONTEND_URL: 'http://yozaver.uz' },
    { FRONTEND_URL: 'https://yozaver.uz/path' },
    { CORS_ORIGINS: '*' },
    { CORS_ORIGINS: 'https://yozaver.uz.evil.test/path' },
    { PORT: '0' },
    { PORT: '65536' },
    { PORT: 'bad' },
    { DATABASE_URL: '' },
    { GOOGLE_CLIENT_ID: 'id' },
    { GOOGLE_CLIENT_SECRET: 'secret' },
    {
      GOOGLE_CLIENT_ID: 'id',
      GOOGLE_CLIENT_SECRET: 'secret',
      GOOGLE_CALLBACK_URL: 'http://api.yozaver.uz/auth/google/callback',
    },
  ])('rejects invalid production values %j', (patch) => {
    expect(() => loadRuntimeConfig({ ...production, ...patch })).toThrow();
  });
  it('accepts the production Google callback', () => {
    expect(() =>
      loadRuntimeConfig({
        ...production,
        GOOGLE_CLIENT_ID: 'id',
        GOOGLE_CLIENT_SECRET: 'secret',
        GOOGLE_CALLBACK_URL: 'https://api.yozaver.uz/auth/google/callback',
      }),
    ).not.toThrow();
  });
  it('keeps localhost and Swagger available in development', () => {
    expect(
      loadRuntimeConfig({
        DATABASE_URL: production.DATABASE_URL,
        JWT_SECRET: 'local',
      }),
    ).toMatchObject({ frontendUrl: 'http://localhost:3000', swagger: true });
  });
});
