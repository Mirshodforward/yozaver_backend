import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { Language, TestMode } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateResultDto } from './dto/create-result.dto.js';

const SUSPICIOUS_WPM_THRESHOLD = 200;

@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateResultDto) {
    const result = await this.prisma.testResult.create({
      data: {
        userId,
        wpm: dto.wpm,
        rawWpm: dto.rawWpm,
        accuracy: dto.accuracy,
        correctChars: dto.correctChars,
        incorrectChars: dto.incorrectChars,
        extraChars: dto.extraChars,
        missedChars: dto.missedChars,
        durationSeconds: dto.durationSeconds,
        mode: dto.mode === 'WORDS' ? TestMode.WORDS : TestMode.TIME,
        modeValue: dto.modeValue,
        language: dto.language === 'uz' ? Language.UZ : Language.EN,
        isFlagged: dto.wpm > SUSPICIOUS_WPM_THRESHOLD,
      },
    });

    const rank = (await this.prisma.testResult.count({ where: { wpm: { gt: result.wpm } } })) + 1;

    return { result, rank };
  }

  async history(userId: string, page: number, pageSize: number) {
    const [items, total] = await Promise.all([
      this.prisma.testResult.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.testResult.count({ where: { userId } }),
    ]);
    return { items, total, page, pageSize };
  }

  personalBest(userId: string) {
    return this.prisma.testResult.findFirst({
      where: { userId },
      orderBy: { wpm: 'desc' },
    });
  }

  async list(params: { flaggedOnly?: boolean; page: number; pageSize: number }) {
    const { flaggedOnly, page, pageSize } = params;
    const where: Prisma.TestResultWhereInput = flaggedOnly ? { isFlagged: true } : {};
    const [items, total] = await Promise.all([
      this.prisma.testResult.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.testResult.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  async remove(id: string) {
    try {
      await this.prisma.testResult.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Result not found');
    }
  }

  count() {
    return this.prisma.testResult.count();
  }

  countToday() {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return this.prisma.testResult.count({ where: { createdAt: { gte: startOfDay } } });
  }

  async averageWpm() {
    const agg = await this.prisma.testResult.aggregate({ _avg: { wpm: true } });
    return agg._avg.wpm ?? 0;
  }
}
