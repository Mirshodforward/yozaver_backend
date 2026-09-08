import { HealthController } from './health.controller.js';
import type { PrismaService } from '../prisma/prisma.service.js';
describe('readiness health check', () => {
  it('reports readiness only when the database responds', async () => {
    const query = vi.fn().mockResolvedValue([{ '?column?': 1 }]);
    const controller = new HealthController({
      $queryRaw: query,
    } as unknown as PrismaService);
    await expect(controller.ready()).resolves.toEqual({
      status: 'ok',
      database: 'connected',
    });
    expect(query).toHaveBeenCalledOnce();
  });
  it('returns a generic 503 when the database fails', async () => {
    const controller = new HealthController({
      $queryRaw: vi
        .fn()
        .mockRejectedValue(new Error('connection failed with private details')),
    } as unknown as PrismaService);
    await expect(controller.ready()).rejects.toMatchObject({
      status: 503,
      message: 'Database is not ready.',
    });
    expect(controller.live()).toEqual({ status: 'ok' });
  });
});
