import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard.js';
import { ApiExcludeEndpoint, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import type { User } from '../generated/prisma/client.js';
import { AuthService } from './auth.service.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  googleAuth() {
    // Passport's Google strategy intercepts this request and redirects to Google.
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiExcludeEndpoint()
  googleAuthCallback(@Req() req: { user: User }, @Res() res: Response) {
    const token = this.authService.signToken(req.user.id);
    const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:3000')
      .trim()
      .replace(/\/$/, '');
    res.redirect(
      `${frontendUrl}/auth/callback#token=${encodeURIComponent(token)}`,
    );
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
