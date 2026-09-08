import { Injectable, NotFoundException } from '@nestjs/common';
import { ClearanceStatus, RequirementStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClearanceDto, ReviewClearanceDto } from './dto';

@Injectable()
export class ClearancesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.clearance.findMany({
      include: { patient: true, academicYear: true, semester: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async eligibility(patientId: string) {
    const patient = await this.prisma.patient.findFirst({ where: { OR: [{ id: patientId }, { patientNumber: patientId }], deletedAt: null } });
    if (!patient) throw new NotFoundException('Active patient not found.');
    const requirements = await this.prisma.healthRequirement.findMany({
      where: { archiveStatus: 'ACTIVE', OR: [{ applicableTo: patient.type }, { applicableTo: 'ALL' }] },
      include: { submissions: { where: { patientId: patient.id, status: RequirementStatus.VERIFIED } } },
    });
    return { patient, eligible: requirements.length > 0 && requirements.every((requirement) => requirement.submissions.length > 0), requirements: requirements.map((requirement) => ({ id: requirement.id, name: requirement.name, verified: requirement.submissions.length > 0 })) };
  }

  async create(dto: CreateClearanceDto, actorId: string) {
    const eligibility = await this.eligibility(dto.patientId);
    const academicYear = await this.prisma.academicYear.findFirst({ where: { isActive: true }, include: { semesters: { where: { isActive: true }, take: 1 } } });
    if (!academicYear) throw new NotFoundException('No active academic year configured.');
    const patient = eligibility.patient;
    const clearance = await this.prisma.clearance.create({
      data: { patientId: patient.id, type: dto.type, academicYearId: academicYear.id, semesterId: dto.semesterId ?? academicYear.semesters[0]?.id, status: eligibility.eligible ? ClearanceStatus.FOR_REVIEW : ClearanceStatus.INCOMPLETE },
      include: { patient: true, academicYear: true, semester: true },
    });
    await this.audit(actorId, 'CLEARANCE_CREATED', clearance.id);
    return clearance;
  }

  async review(id: string, dto: ReviewClearanceDto, actorId: string) {
    const clearance = await this.prisma.clearance.findUnique({ where: { id } });
    if (!clearance) throw new NotFoundException('Clearance not found.');
    const updated = await this.prisma.clearance.update({ where: { id }, data: { status: dto.status, remarks: dto.remarks, issuedById: dto.status === ClearanceStatus.CLEARED ? actorId : undefined, issuedAt: dto.status === ClearanceStatus.CLEARED ? new Date() : undefined } });
    await this.audit(actorId, `CLEARANCE_${dto.status}`, id);
    return updated;
  }

  private audit(actorId: string, action: string, entityId: string) {
    return this.prisma.auditLog.create({ data: { actorId, action, entity: 'Clearance', entityId } });
  }
}
