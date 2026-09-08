import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Role } from '../generated/prisma/client.js';

interface UpsertFromGoogleInput {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

function getAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async upsertFromGoogle(input: UpsertFromGoogleInput) {
    const existing = await this.prisma.user.findUnique({ where: { googleId: input.googleId } });
    if (existing) {
      return this.prisma.user.update({
        where: { id: existing.id },
        data: { name: input.name, avatarUrl: input.avatarUrl, email: input.email },
      });
    }

    const isPreApprovedAdmin = getAdminEmails().includes(input.email.toLowerCase());

    return this.prisma.user.create({
      data: {
        googleId: input.googleId,
        email: input.email,
        name: input.name,
        avatarUrl: input.avatarUrl,
        role: isPreApprovedAdmin ? Role.ADMIN : Role.USER,
      },
    });
  }

  async list(params: { search?: string; page: number; pageSize: number }) {
    const { search, page, pageSize } = params;
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          isBanned: true,
          createdAt: true,
          _count: { select: { results: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  adminUpdate(id: string, data: { role?: Role; isBanned?: boolean }) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...(data.role !== undefined ? { role: data.role } : {}),
        ...(data.isBanned !== undefined ? { isBanned: data.isBanned } : {}),
      },
    });
  }

  count() {
    return this.prisma.user.count();
  }

  countCreatedSince(date: Date) {
    return this.prisma.user.count({ where: { createdAt: { gte: date } } });
  }
}
