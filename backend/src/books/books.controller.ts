import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Multer } from 'multer';
import { BooksService } from './books.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller()
export class BooksController {
  constructor(private books: BooksService) {}
  @Get('books')
  list(
    @Query('q') q?: string,
    @Query('sort') sort?: 'name' | 'author',
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.books.listPublic({
      q,
      sort,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
  @Get('books/:id')
  details(@Param('id', ParseIntPipe) id: number) {
    return this.books.details(id);
  }
  @UseGuards(AuthGuard)
  @Get('me/books')
  myBooks(@Req() req: any) {
    return this.books.myList(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  @Post('me/books')
  addMyBook(
    @Req() req: any,
    @Body() body: { name: string; author: string; photoUrl?: string | null },
    @UploadedFile() file?: Multer.File,
  ) {
    return this.books.addMyBook(req.user.sub, body, file);
  }

  @UseGuards(AuthGuard)
  @Delete('me/books/:id')
  deleteMyBook(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.books.deleteMyBook(req.user.sub, id);
  }
  @UseGuards(AuthGuard)
  @Post('books/:id/exchange')
  requestExchange(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.books.requestExchange(req.user.sub, id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/books/:id')
  adminDelete(@Param('id', ParseIntPipe) id: number) {
    return this.books.deleteAny(id);
  }
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('photo'))
  @Patch('admin/books/:id')
  adminUpdate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; author?: string; photoUrl?: string | null },
    @UploadedFile() file?: Multer.File,
  ) {
    return this.books.updateAny(id, body, file as any);
  }
}
