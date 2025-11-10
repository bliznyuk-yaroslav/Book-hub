import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async list() {
    const rows = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: { select: { books: true } },
      },
    });
    const items = rows.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role as any,
      createdAt: u.createdAt,
      booksCount: u._count.books,
    }));
    return { items };
  }

  async create(data: {
    email: string;
    password: string;
    name?: string | null;
    role?: 'USER' | 'ADMIN';
  }) {
    const exists = await this.prisma.user.findUnique({
      where: { email: data.email },
    });
    if (exists) throw new ConflictException('Email already in use');
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name ?? null,
        role: (data.role ?? 'USER') as any,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return { user };
  }

  async update(
    id: number,
    data: {
      email?: string;
      password?: string;
      name?: string | null;
      role?: 'USER' | 'ADMIN';
    },
  ) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');

    let passwordHash: string | undefined;
    if (data.password) passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: data.email ?? undefined,
        name: data.name === undefined ? undefined : data.name,
        role: (data.role as any) ?? undefined,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    return { user };
  }

  async remove(id: number) {
    const existing = await this.prisma.user.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('User not found');
    await this.prisma.user.delete({ where: { id } });
    return { ok: true };
  }
}
