import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { LeaderboardPeriod } from './dto/leaderboard-query.dto.js';

function sinceDateFor(period: LeaderboardPeriod): Date {
  const now = new Date();
  switch (period) {
    case 'daily': {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    case 'weekly': {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      return d;
    }
    case 'monthly': {
      const d = new Date(now);
      d.setMonth(d.getMonth() - 1);
      return d;
    }
    default:
      return new Date(0);
  }
}

interface LeaderboardRow {
  userId: string;
  name: string;
  avatarUrl: string | null;
  wpm: number;
  accuracy: number;
  createdAt: Date;
}

@Injectable()
export class LeaderboardService {
  constructor(private readonly prisma: PrismaService) {}

  async top(period: LeaderboardPeriod, limit: number) {
    const since = sinceDateFor(period);

    const rows = await this.prisma.$queryRaw<LeaderboardRow[]>`
      SELECT * FROM (
        SELECT DISTINCT ON (u.id)
          u.id AS "userId",
          u.name,
          u."avatarUrl",
          tr.wpm,
          tr.accuracy,
          tr."createdAt"
        FROM "TestResult" tr
        JOIN "User" u ON u.id = tr."userId"
        WHERE tr."createdAt" >= ${since} AND u."isBanned" = false
        ORDER BY u.id, tr.wpm DESC
      ) best
      ORDER BY wpm DESC
      LIMIT ${limit}
    `;

    return rows.map((row, index) => ({ ...row, rank: index + 1 }));
  }
}
