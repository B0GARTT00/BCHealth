import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken, Role, User, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

type AuthUser = User & {
  roles: (UserRole & { role: Role })[];
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

  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already in use.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        displayName: dto.displayName,
        status: 'ACTIVE',
      },
      include: { roles: { include: { role: true } } },
    }) as AuthUser;

    const session = await this.createSession(user);

    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'CREATE',
        entity: 'User',
        entityId: user.id,
        ipAddress,
        userAgent,
      },
    });

    return {
      ...session,
      user: this.toSafeUser(user),
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: { include: { role: true } } },
    }) as AuthUser | null;

    const valid =
      user !== null &&
      user.status === 'ACTIVE' &&
      (await bcrypt.compare(dto.password, user.passwordHash));

    if (!valid) {
      await this.prisma.auditLog.create({
        data: {
          actorId: user?.id,
          action: 'LOGIN_FAILED',
          entity: 'User',
          entityId: user?.id,
          ipAddress,
          userAgent,
          metadata: { attemptedEmail: dto.email },
        },
      });

      throw new UnauthorizedException('Invalid credentials.');
    }

    const session = await this.createSession(user);

    await this.prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: 'LOGIN',
        entity: 'User',
        entityId: user.id,
        ipAddress,
        userAgent,
      },
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
    }) as AuthUser | null;

    if (user?.status !== 'ACTIVE') throw new UnauthorizedException('Invalid refresh token.');

    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    return {
      ...(await this.createSession(user)),
      user: this.toSafeUser(user),
    };
  }

  async logout(refreshToken?: string, actorId?: string, ipAddress?: string, userAgent?: string) {
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
        data: {
          actorId,
          action: 'LOGOUT',
          entity: 'User',
          entityId: actorId,
          ipAddress,
          userAgent,
        },
      });
    }

    return { message: 'Logged out.' };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    }) as AuthUser | null;

    if (user?.status !== 'ACTIVE') throw new UnauthorizedException('User is inactive.');
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
        tokenHash: await bcrypt.hash(refreshToken, 12),
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
      if (await bcrypt.compare(refreshToken, storedToken.tokenHash)) return storedToken;
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
