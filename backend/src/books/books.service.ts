import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { Prisma } from '@prisma/client';
import type { Multer } from 'multer';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BooksService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private cloudinary: CloudinaryService,
  ) {}

  async listPublic(params: {
    q?: string;
    sort?: 'name' | 'author';
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page ?? 1);
    const limit = Math.min(50, Math.max(1, params.limit ?? 10));
    const skip = (page - 1) * limit;

    const where: Prisma.BookWhereInput = params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: 'insensitive' as const } },
            { author: { contains: params.q, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const orderBy = params.sort
      ? { [params.sort]: 'asc' as const }
      : { createdAt: 'desc' as const };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.book.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: { owner: { select: { id: true, email: true, name: true } } },
      }),
      this.prisma.book.count({ where }),
    ]);

    return { items, page, limit, total, pages: Math.ceil(total / limit) };
  }

  async details(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { owner: { select: { id: true, email: true, name: true } } },
    });
    if (!book) throw new NotFoundException('Book not found');
    return { book };
  }

  async myList(userId: number) {
    const items = await this.prisma.book.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return { items };
  }

  async addMyBook(
    userId: number,
    data: { name: string; author: string; photoUrl?: string | null },
    file?: Multer.File,
  ) {
    let uploadedUrl: string | null | undefined = data.photoUrl ?? null;
    if (file?.buffer && file.size > 0) {
      const res = await this.cloudinary.uploadImage(file.buffer);
      uploadedUrl = res.secure_url;
    }
    const book = await this.prisma.book.create({
      data: {
        name: data.name,
        author: data.author,
        photoUrl: uploadedUrl ?? null,
        ownerId: userId,
      },
    });
    return { book };
  }

  async deleteMyBook(userId: number, id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    if (book.ownerId !== userId) throw new ForbiddenException('Not your book');
    await this.prisma.book.delete({ where: { id } });
    return { ok: true };
  }
  async updateAny(
    id: number,
    body: { name?: string; author?: string; photoUrl?: string | null },
    file?: Multer.File,
  ) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    let newPhotoUrl = body.photoUrl;
    if (file?.buffer && file.size > 0) {
      const upload = await this.cloudinary.uploadImage(file.buffer);
      newPhotoUrl = upload.secure_url;
    }

    const data: any = {};
    if (typeof body.name === 'string') data.name = body.name;
    if (typeof body.author === 'string') data.author = body.author;
    if (typeof newPhotoUrl !== 'undefined') data.photoUrl = newPhotoUrl;

    const updated = await this.prisma.book.update({ where: { id }, data });
    return { book: updated };
  }

  async requestExchange(userId: number, bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
      include: { owner: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    if (book.ownerId === userId)
      throw new ForbiddenException("Can't request exchange for your own book");

    const sender = await this.prisma.user.findUnique({ where: { id: userId } });
    const senderBooks = await this.prisma.book.findMany({
      where: { ownerId: userId },
      select: { id: true, name: true, author: true },
    });

    if (book.owner.email) {
      await this.mail.sendExchangeRequest({
        to: book.owner.email,
        fromEmail: sender?.email ?? 'unknown@local',
        fromName: sender?.name ?? null,
        senderBooks,
        bookRequested: { id: book.id, name: book.name, author: book.author },
      });
    }

    return { ok: true };
  }

  async deleteAny(id: number) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');
    await this.prisma.book.delete({ where: { id } });
    return { ok: true };
  }
}
