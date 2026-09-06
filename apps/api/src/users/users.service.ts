import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        displayName: true,
        isActive: true,
        patientId: true,
        roles: { select: { role: { select: { name: true } } } },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
