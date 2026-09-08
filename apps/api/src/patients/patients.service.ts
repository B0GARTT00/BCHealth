import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PatientType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAllergyDto,
  CreateEmergencyContactDto,
  CreateMedicalConditionDto,
  CreateMedicalHistoryDto,
  CreatePatientDto,
  UpdatePatientDto,
} from './dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePatientDto) {
    try {
      const { program, yearLevel, department, ...patientData } = dto;
      return await this.prisma.patient.create({
        data: {
          ...patientData,
          studentProfile: dto.type === 'STUDENT' && program ? { create: { studentId: dto.patientNumber, program, yearLevel } } : undefined,
          employeeProfile: dto.type !== 'STUDENT' && department ? { create: { employeeId: dto.patientNumber, department } } : undefined,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A patient with this ID or email already exists.');
      }
      throw error;
    }
  }

  async update(id: string, dto: UpdatePatientDto) {
    try {
      const { program, yearLevel, department, ...patientData } = dto;
      const existing = await this.prisma.patient.findUnique({ where: { id }, include: { studentProfile: true, employeeProfile: true } });
      if (!existing) throw new NotFoundException('Patient not found.');
      const type = dto.type ?? existing.type;
      return await this.prisma.$transaction(async (transaction) => {
        const patient = await transaction.patient.update({ where: { id }, data: patientData });
        if (type === 'STUDENT' && (program !== undefined || yearLevel !== undefined || existing.studentProfile)) {
          await transaction.studentProfile.upsert({
            where: { patientId: id },
            update: { program: program ?? existing.studentProfile?.program ?? '', yearLevel },
            create: { patientId: id, studentId: patient.patientNumber, program: program ?? '', yearLevel },
          });
        }
        if (type !== 'STUDENT' && (department !== undefined || existing.employeeProfile)) {
          await transaction.employeeProfile.upsert({
            where: { patientId: id },
            update: { department: department ?? existing.employeeProfile?.department ?? '' },
            create: { patientId: id, employeeId: patient.patientNumber, department: department ?? '' },
          });
        }
        return transaction.patient.findUnique({ where: { id }, include: { studentProfile: true, employeeProfile: true } });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A patient with this ID or email already exists.');
      }
      throw error;
    }
  }

  async remove(id: string, actorId: string) {
    await this.ensureExists(id);
    const patient = await this.prisma.patient.update({ where: { id }, data: { deletedAt: new Date() } });
    await this.audit(actorId, 'PATIENT_ARCHIVED', id);
    return patient;
  }

  async restore(id: string, actorId: string) {
    await this.ensureExists(id);
    const patient = await this.prisma.patient.update({ where: { id }, data: { deletedAt: null } });
    await this.audit(actorId, 'PATIENT_RESTORED', id);
    return patient;
  }

  addEmergencyContact(patientId: string, dto: CreateEmergencyContactDto, actorId: string) {
    return this.createRelated(patientId, actorId, 'PATIENT_EMERGENCY_CONTACT_ADDED', () =>
      this.prisma.emergencyContact.create({ data: { patientId, ...dto } }),
    );
  }

  addMedicalHistory(patientId: string, dto: CreateMedicalHistoryDto, actorId: string) {
    return this.createRelated(patientId, actorId, 'PATIENT_HISTORY_ADDED', () =>
      this.prisma.medicalHistory.create({ data: { patientId, ...dto } }),
    );
  }

  addCondition(patientId: string, dto: CreateMedicalConditionDto, actorId: string) {
    return this.createRelated(patientId, actorId, 'PATIENT_CONDITION_ADDED', () =>
      this.prisma.medicalCondition.create({
        data: {
          patientId,
          ...dto,
          diagnosedAt: dto.diagnosedAt ? new Date(dto.diagnosedAt) : undefined,
          resolvedAt: dto.resolvedAt ? new Date(dto.resolvedAt) : undefined,
        },
      }),
    );
  }

  addAllergy(patientId: string, dto: CreateAllergyDto, actorId: string) {
    return this.createRelated(patientId, actorId, 'PATIENT_ALLERGY_ADDED', () =>
      this.prisma.allergy.create({ data: { patientId, ...dto } }),
    );
  }

  private async createRelated<T>(patientId: string, actorId: string, action: string, create: () => Promise<T>) {
    await this.ensureExists(patientId);
    const record = await create();
    await this.audit(actorId, action, patientId);
    return record;
  }

  private async ensureExists(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) throw new NotFoundException('Patient not found.');
    return patient;
  }

  private audit(actorId: string, action: string, patientId: string) {
    return this.prisma.auditLog.create({
      data: { actorId, action, entity: 'Patient', entityId: patientId },
    });
  }

  findAll(search?: string, page = 1, limit = 20, type?: PatientType) {
    const where = search
      ? {
          OR: [
            { patientNumber: { contains: search } },
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
          ],
          deletedAt: null,
          type,
        }
      : { deletedAt: null, type };

    return this.prisma.patient.findMany({
      where,
      include: {
        studentProfile: true,
        employeeProfile: true,
        visits: { orderBy: { visitDate: 'desc' }, take: 1 },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });
  }

  findOne(id: string) {
    return this.prisma.patient.findUnique({
      where: { id },
      include: {
        emergencyContacts: true,
        studentProfile: true,
        employeeProfile: true,
        allergies: true,
        conditions: true,
        medicalHistories: { orderBy: { recordedAt: 'desc' } },
        visits: { orderBy: { visitDate: 'desc' }, take: 5 },
      },
    });
  }
}
