import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get()
  list() {
    return this.users.list();
  }

  @Post()
  create(
    @Body()
    body: {
      email: string;
      password: string;
      name?: string | null;
      role?: 'USER' | 'ADMIN';
    },
  ) {
    return this.users.create(body);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: {
      email?: string;
      password?: string;
      name?: string | null;
      role?: 'USER' | 'ADMIN';
    },
  ) {
    return this.users.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.users.remove(id);
  }
}
