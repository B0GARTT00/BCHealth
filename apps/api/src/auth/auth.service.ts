import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma, RefreshToken, User, UserRole, Role } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, SignupDto } from './dto';
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
    });

    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('Invalid credentials.');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!valid) {
      await this.prisma.auditLog.create({
        data: {
          actorId: user.id,
          action: 'LOGIN_FAILED',
          entity: 'User',
          entityId: user.id,
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

  async signup(dto: SignupDto) {
    const studentRole = await this.prisma.role.findUnique({ where: { name: 'STUDENT' } });
    if (!studentRole) throw new ConflictException('Student role is not configured. Run the database seed first.');

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email.toLowerCase(),
          displayName: dto.displayName.trim(),
          passwordHash: await bcrypt.hash(dto.password, 12),
          roles: { create: { roleId: studentRole.id } },
        },
        include: { roles: { include: { role: true } } },
      });
<<<<<<< HEAD
      await this.prisma.auditLog.create({ data: { action: 'CREATE', entity: 'User', entityId: user.id } });
      return {
        message: 'Account created successfully.',
=======
      await this.prisma.auditLog.create({ data: { action: 'SIGNUP', entity: 'User', entityId: user.id } });
      const verificationUrl = this.getVerificationUrl(verificationToken);
      await this.sendVerificationEmail(user.email, user.displayName, verificationUrl);
      const isProduction = this.config.get<string>('NODE_ENV') === 'production';
      return {
        message: 'Account created. Check your institutional email to activate your account.',
        // Developers need the token URL even when a shared Brevo key is present.
        // Never expose it from a production API response.
        ...(!isProduction ? { verificationUrl } : {}),
>>>>>>> fd2c3141e608b53759333afb9f3f788d6b0f9fc1
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('An account with this email already exists.');
      }
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyEmail(_token: string) {
    throw new UnauthorizedException('Email verification is not yet available.');
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

    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('Invalid refresh token.');

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

    if (!user || user.status !== 'ACTIVE') throw new UnauthorizedException('User is inactive.');
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

  private hashVerificationToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  private getVerificationUrl(token: string) {
    const apiUrl = this.config.get<string>('PUBLIC_API_URL') ?? 'http://localhost:3000/api';
    return `${apiUrl.replace(/\/$/, '')}/auth/verify-email?token=${token}`;
  }

  private async sendVerificationEmail(email: string, displayName: string, verificationUrl: string) {
    const apiKey = this.config.get<string>('BREVO_API_KEY');
    if (!apiKey) return;
    try {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': apiKey, 'content-type': 'application/json' },
        body: JSON.stringify({
          sender: {
            name: this.config.get<string>('EMAIL_FROM_NAME') ?? 'CLINOVA',
            email: this.config.get<string>('EMAIL_FROM_ADDRESS') ?? 'no-reply@brokenshire.edu.ph',
          },
          to: [{ email, name: displayName }],
          subject: 'Activate your CLINOVA account',
          htmlContent: `<p>Hello ${displayName},</p><p>Activate your CLINOVA account by clicking the link below:</p><p><a href="${verificationUrl}">Activate account</a></p><p>This link expires in 24 hours.</p>`,
        }),
      });
      if (!response.ok) {
        console.error('Brevo rejected the verification email:', response.status);
      }
    } catch (error) {
      console.error('Unable to send verification email.', error);
    }
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
