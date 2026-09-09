import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction, CertificateType } from '@prisma/client';
import { CreateCertificateDto } from './dto';

@Injectable()
export class CertificatesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    const certificates = await this.prisma.medicalCertificate.findMany({ include: { patient: true }, orderBy: { issuedAt: 'desc' } });
    return certificates.map((certificate) => ({ ...certificate, certificateNumber: `CLN-${certificate.issuedAt.getFullYear()}-${certificate.id.slice(0, 8).toUpperCase()}` }));
  }

  async create(dto: CreateCertificateDto, issuerId: string) {
    const patient = await this.prisma.patient.findFirst({ where: { OR: [{ id: dto.patientId }, { patientNumber: dto.patientId }], deletedAt: null } });
    if (!patient) throw new NotFoundException('Active patient not found.');
    const certificate = await this.prisma.medicalCertificate.create({
      data: { patientId: patient.id, type: dto.type as CertificateType, purpose: dto.purpose, validUntil: dto.validUntil ? new Date(dto.validUntil) : undefined, issuedById: issuerId, remarks: dto.remarks },
      include: { patient: true },
    });
    await this.prisma.auditLog.create({ data: { actorId: issuerId, action: AuditAction.MEDICAL_CERTIFICATE_ISSUED, entity: 'MedicalCertificate', entityId: certificate.id } });
    return { ...certificate, certificateNumber: `CLN-${certificate.issuedAt.getFullYear()}-${certificate.id.slice(0, 8).toUpperCase()}` };
  }
}
