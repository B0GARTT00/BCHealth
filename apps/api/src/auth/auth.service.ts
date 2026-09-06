import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, User } from '@prisma/client';
import argon2 from 'argon2';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto';

type AuthUser = User & {
  roles: { role: { name: string } }[];
};

type JwtPayload = {
  sub: string;
  email: string;
  roles: string[];
  patientId?: string | null;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: { include: { role: true } } },
    });

    if (!user?.isActive) throw new UnauthorizedException('Invalid credentials.');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials.');

    const session = await this.createSession(user);

    await this.prisma.auditLog.create({
      data: { actorId: user.id, action: 'LOGIN', entity: 'User', entityId: user.id },
    });

    return {
      ...session,
      user: this.toSafeUser(user),
    };
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyRefreshToken(refreshToken);
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });
    const storedToken = await this.findMatchingRefreshToken(refreshToken, storedTokens);
    if (!storedToken) throw new UnauthorizedException('Invalid refresh token.');

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { roles: { include: { role: true } } },
    });
    if (!user?.isActive) throw new UnauthorizedException('Invalid refresh token.');

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return {
      ...(await this.createSession(user)),
      user: this.toSafeUser(user),
    };
  }

  async logout(refreshToken?: string, actorId?: string) {
    if (refreshToken) {
      const payload = await this.verifyRefreshToken(refreshToken).catch(() => null);
      if (payload) {
        const storedTokens = await this.prisma.refreshToken.findMany({
          where: { userId: payload.sub, revokedAt: null },
        });
        const storedToken = await this.findMatchingRefreshToken(refreshToken, storedTokens);
        if (storedToken) {
          await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
          });
        }
      }
    }

    if (actorId) {
      await this.prisma.auditLog.create({
        data: { actorId, action: 'LOGOUT', entity: 'User', entityId: actorId },
      });
    }

    return { message: 'Logged out.' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });
    if (!user?.isActive) throw new UnauthorizedException('User is inactive.');
    return this.toSafeUser(user);
  }

  private async createSession(user: AuthUser) {
    const roles = user.roles.map((entry) => entry.role.name);
    const payload: JwtPayload = { sub: user.id, email: user.email, roles, patientId: user.patientId };
    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET') ?? 'development-only-secret',
      expiresIn: this.config.get<string>('JWT_EXPIRES_IN') ?? '15m',
    });
    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? 'development-only-refresh-secret',
      expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d',
    });

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: await argon2.hash(refreshToken),
        expiresAt: this.getRefreshExpiry(),
      },
    });

    return { accessToken, refreshToken };
  }

  private async verifyRefreshToken(refreshToken: string) {
    try {
      return await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') ?? 'development-only-refresh-secret',
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  private async findMatchingRefreshToken(refreshToken: string, storedTokens: RefreshToken[]) {
    for (const storedToken of storedTokens) {
      if (await argon2.verify(storedToken.tokenHash, refreshToken)) return storedToken;
    }
    return null;
  }

  private getRefreshExpiry() {
    const configured = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
    const match = configured.match(/^(\d+)([dhm])$/);
    if (!match) return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const amount = Number(match[1]);
    const unit = match[2];
    const multipliers = { m: 60_000, h: 60 * 60_000, d: 24 * 60 * 60_000 };
    return new Date(Date.now() + amount * multipliers[unit as keyof typeof multipliers]);
  }

  private toSafeUser(user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles.map((entry) => entry.role.name),
      patientId: user.patientId,
    };
  }
}
