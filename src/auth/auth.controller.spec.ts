import { AuthController } from './auth.controller.js';
import type { AuthService } from './auth.service.js';
import type { User } from '../generated/prisma/client.js';
import type { Response } from 'express';
describe('Google callback redirect', () => {
  afterEach(() => vi.unstubAllEnvs());
  it('keeps the token in a browser fragment rather than a server query', () => {
    vi.stubEnv('FRONTEND_URL', 'https://yozaver.uz/');
    const redirect = vi.fn();
    const controller = new AuthController({
      signToken: () => 'signed.test.token',
    } as unknown as AuthService);
    controller.googleAuthCallback({ user: { id: 'test' } as User }, {
      redirect,
    } as unknown as Response);
    const url = new URL(redirect.mock.calls[0][0]);
    expect(url.origin).toBe('https://yozaver.uz');
    expect(url.pathname).toBe('/auth/callback');
    expect(url.search).toBe('');
    expect(new URLSearchParams(url.hash.slice(1)).get('token')).toBe(
      'signed.test.token',
    );
  });
});
