import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({ compare: jest.fn(), hash: jest.fn() }));

const demoUser = {
  id: 'user-1',
  email: 'admin.demo@brokenshire.edu.ph',
  passwordHash: 'hash',
  displayName: 'Demo Administrator',
  status: 'ACTIVE',
  emailVerifiedAt: new Date(),
  emailVerificationTokenHash: null,
  emailVerificationExpiresAt: null,
  patientId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  roles: [{ role: { name: 'ADMINISTRATOR' } }],
};

const compareMock = bcrypt.compare as jest.MockedFunction<
  (password: string, hash: string) => Promise<boolean>
>;
const hashMock = jest.mocked(bcrypt.hash);

function createService() {
  const prisma = {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
  };
  const jwt = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
  const config = {
    get: jest.fn((key: string) => {
      const values: Record<string, string> = {
        JWT_SECRET: 'secret',
        JWT_REFRESH_SECRET: 'refresh-secret',
        JWT_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return values[key];
    }),
  };

  return {
    service: new AuthService(
      prisma as never,
      jwt as unknown as JwtService,
      config as unknown as ConfigService,
    ),
    prisma,
    jwt,
  };
}

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    hashMock.mockResolvedValue('hashed-refresh-token' as never);
    compareMock.mockResolvedValue(true);
  });

  it('logs in an active user and stores a hashed refresh token', async () => {
    const { service, prisma, jwt } = createService();
    prisma.user.findUnique.mockResolvedValue(demoUser);
    jwt.signAsync.mockResolvedValueOnce('access-token').mockResolvedValueOnce('refresh-token');

    const result = await service.login({
      email: 'admin.demo@brokenshire.edu.ph',
      password: 'DemoPass123!',
    });

    expect(result).toMatchObject({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { email: 'admin.demo@brokenshire.edu.ph', roles: ['ADMINISTRATOR'] },
    });
    expect(prisma.refreshToken.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ tokenHash: expect.any(String) }),
      }),
    );
    expect(prisma.auditLog.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ action: 'LOGIN' }) }),
    );
  });

  it('rotates refresh tokens', async () => {
    const { service, prisma, jwt } = createService();
    prisma.refreshToken.findMany.mockResolvedValue([{ id: 'token-1', tokenHash: 'hash' }]);
    prisma.user.findUnique.mockResolvedValue(demoUser);
    jwt.verifyAsync.mockResolvedValue({ sub: 'user-1' });
    jwt.signAsync.mockResolvedValueOnce('new-access').mockResolvedValueOnce('new-refresh');

    const result = await service.refresh('old-refresh');

    expect(result.accessToken).toBe('new-access');
    expect(prisma.refreshToken.update).toHaveBeenCalledWith({
      where: { id: 'token-1' },
      data: { revokedAt: expect.any(Date) },
    });
    expect(prisma.refreshToken.create).toHaveBeenCalled();
  });

  it('verifies an account and invalidates the verification token', async () => {
    const { service, prisma } = createService();
    prisma.user.findFirst.mockResolvedValue(demoUser);
    prisma.user.update.mockResolvedValue(demoUser);
    prisma.auditLog.create.mockResolvedValue({});

    await expect(service.verifyEmail('activation-token')).resolves.toEqual({
      message: 'Email verified. You can now sign in.',
    });

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: {
        emailVerificationTokenHash: expect.any(String),
        emailVerificationExpiresAt: { gt: expect.any(Date) },
      },
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: demoUser.id },
      data: expect.objectContaining({
        emailVerifiedAt: expect.any(Date),
        emailVerificationTokenHash: null,
        emailVerificationExpiresAt: null,
      }),
    });
  });
});
