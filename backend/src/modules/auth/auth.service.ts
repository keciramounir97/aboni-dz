import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UsersService } from '../users/users.service';
import { PasswordReset } from './password-reset.model';
import { RegisterDto, LoginDto, ResetPasswordDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException({ success: false, message: 'Email already registered' });
    }
    const password_hash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email.toLowerCase().trim(),
      name: dto.name.trim(),
      password_hash,
      role: 'user',
      permissions: null,
      is_active: true,
    });
    const accessToken = await this.signToken(user);
    return { accessToken, user: this.sanitize(user) };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || !user.is_active) {
      throw new UnauthorizedException({ success: false, message: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(dto.password, user.password_hash);
    if (!match) {
      throw new UnauthorizedException({ success: false, message: 'Invalid credentials' });
    }
    const accessToken = await this.signToken(user);
    return { accessToken, user: this.sanitize(user) };
  }

  async forgotPassword(email: string) {
    const normalized = email.toLowerCase().trim();
    const user = await this.usersService.findByEmail(normalized);
    const token = randomBytes(32).toString('hex');
    if (user) {
      const expires = new Date(Date.now() + 60 * 60 * 1000);
      const pad = (n: number) => String(n).padStart(2, '0');
      const expiresSql = `${expires.getFullYear()}-${pad(expires.getMonth() + 1)}-${pad(expires.getDate())} ${pad(expires.getHours())}:${pad(expires.getMinutes())}:${pad(expires.getSeconds())}`;
      await PasswordReset.query().insert({
        email: normalized,
        token,
        expires_at: expiresSql,
        used: false,
      });
    }
    const payload: { message: string; token?: string } = {
      message: 'If that email exists, a reset link was sent',
    };
    if (process.env.NODE_ENV !== 'production') {
      payload.token = user ? token : undefined;
    }
    return payload;
  }

  async resetPassword(dto: ResetPasswordDto) {
    const row = await PasswordReset.query()
      .where('token', dto.token)
      .where('used', 0)
      .first();
    if (!row) {
      throw new BadRequestException({ success: false, message: 'Invalid or expired token' });
    }
    const expiresAt = new Date(row.expires_at);
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
      throw new BadRequestException({ success: false, message: 'Invalid or expired token' });
    }
    const user = await this.usersService.findByEmail(row.email);
    if (!user) {
      throw new BadRequestException({ success: false, message: 'Invalid or expired token' });
    }
    const password_hash = await bcrypt.hash(dto.password, 10);
    await this.usersService.updatePassword(user.id, password_hash);
    await PasswordReset.query().findById(row.id).patch({ used: true });
    return { message: 'Password updated' };
  }

  async me(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.is_active) {
      throw new UnauthorizedException({ success: false, message: 'Unauthorized' });
    }
    return this.sanitize(user);
  }

  private async signToken(user: { id: number; email: string; role: string }) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  private sanitize(user: any) {
    const { password_hash, ...rest } = user;
    return rest;
  }
}
