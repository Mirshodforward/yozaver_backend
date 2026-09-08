import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service.js';

interface GoogleProfileInput {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  validateGoogleUser(input: GoogleProfileInput) {
    return this.usersService.upsertFromGoogle(input);
  }

  signToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }
}
