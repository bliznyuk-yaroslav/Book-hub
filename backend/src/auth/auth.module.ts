import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      secret: process.env.JWT_secret || process.env.JWT_secter || 'dev-secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, AuthGuard, RolesGuard],
  controllers: [AuthController],
  exports: [AuthService, AuthGuard, RolesGuard, JwtModule],
})
export class AuthModule {}
