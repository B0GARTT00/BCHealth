import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RequirementStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequirementDto, CreateSubmissionDto, ReviewSubmissionDto } from './dto';

@Injectable()
export class RequirementsService {
  constructor(private readonly prisma: PrismaService) {}

  listRequirements() {
    return this.prisma.healthRequirement.findMany({
      where: { archiveStatus: 'ACTIVE' },
      include: { academicYear: true, semester: true, _count: { select: { submissions: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createRequirement(dto: CreateRequirementDto, actorId: string) {
    const requirement = await this.prisma.healthRequirement.create({
      data: {
        ...dto,
        deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      },
    });
    await this.audit(actorId, 'REQUIREMENT_CREATED', requirement.id);
    return requirement;
  }

  listSubmissions(status?: RequirementStatus) {
    return this.prisma.requirementSubmission.findMany({
      where: status ? { status } : undefined,
      include: { requirement: true, patient: true, document: true },
      orderBy: { submittedAt: 'desc' },
    });
  }

  async submit(dto: CreateSubmissionDto, actorId: string) {
    const [requirement, patient] = await Promise.all([
      this.prisma.healthRequirement.findUnique({ where: { id: dto.requirementId } }),
      this.prisma.patient.findFirst({ where: { OR: [{ id: dto.patientId }, { patientNumber: dto.patientId }], deletedAt: null } }),
    ]);
    if (!requirement) throw new NotFoundException('Health requirement not found.');
    if (!patient) throw new NotFoundException('Active patient not found.');
    try {
      const submission = await this.prisma.requirementSubmission.create({
        data: { requirementId: requirement.id, patientId: patient.id, documentId: dto.documentId, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined },
      });
      await this.audit(actorId, 'REQUIREMENT_SUBMITTED', submission.id);
      return submission;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new ConflictException('This requirement has already been submitted for the patient.');
      throw error;
    }
  }

  async review(id: string, dto: ReviewSubmissionDto, reviewerId: string) {
    const submission = await this.prisma.requirementSubmission.findUnique({ where: { id } });
    if (!submission) throw new NotFoundException('Requirement submission not found.');
    const updated = await this.prisma.requirementSubmission.update({
      where: { id },
      data: { status: dto.status, notes: dto.notes, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined, reviewerId, reviewedAt: new Date() },
    });
    await this.audit(reviewerId, `REQUIREMENT_${dto.status}`, id);
    return updated;
  }

  private audit(actorId: string, action: string, entityId: string) {
    return this.prisma.auditLog.create({ data: { actorId, action, entity: 'Requirement', entityId } });
  }
}
