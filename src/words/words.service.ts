import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Language } from '../generated/prisma/client.js';

function shuffle<T>(input: T[]): T[] {
  const result = [...input];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

@Injectable()
export class WordsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRandomWords(language: Language, count: number): Promise<string[]> {
    const words = await this.prisma.word.findMany({
      where: { language, isActive: true },
      select: { text: true },
    });
    const pool = shuffle(words.map((w) => w.text));
    if (pool.length === 0) {
      return [];
    }

    const result: string[] = [];
    while (result.length < count) {
      result.push(...pool);
    }
    return result.slice(0, count);
  }

  async list(params: { language?: Language; page: number; pageSize: number }) {
    const { language, page, pageSize } = params;
    const where = language ? { language } : {};
    const [items, total] = await Promise.all([
      this.prisma.word.findMany({
        where,
        orderBy: { text: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.word.count({ where }),
    ]);
    return { items, total, page, pageSize };
  }

  create(text: string, language: Language) {
    return this.prisma.word.create({ data: { text: text.trim().toLowerCase(), language } });
  }

  async update(id: string, data: { text?: string; isActive?: boolean }) {
    await this.ensureExists(id);
    return this.prisma.word.update({
      where: { id },
      data: { ...data, text: data.text?.trim().toLowerCase() },
    });
  }

  async remove(id: string) {
    await this.ensureExists(id);
    await this.prisma.word.delete({ where: { id } });
  }

  private async ensureExists(id: string) {
    const word = await this.prisma.word.findUnique({ where: { id } });
    if (!word) {
      throw new NotFoundException('Word not found');
    }
  }
}
