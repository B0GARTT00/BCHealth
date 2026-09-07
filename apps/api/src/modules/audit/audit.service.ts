import { Injectable } from '@nestjs/common';
import { AuditLogEntity } from './entities/audit.entity';

@Injectable()
export class AuditService {
  private logs: AuditLogEntity[] = [];

  findAll(): AuditLogEntity[] {
    return this.logs;
  }

  findOne(id: string): AuditLogEntity {
    const log = this.logs.find((l) => l.id === id);
    if (!log) {
      throw new Error('Audit log not found');
    }
    return log;
  }
}
