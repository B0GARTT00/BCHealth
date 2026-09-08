import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  list(action?: string, entity?: string) {
    return this.prisma.auditLog.findMany({
      where: { action: action ? { contains: action } : undefined, entity: entity ? { equals: entity } : undefined },
      include: { actor: { select: { displayName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }
}
