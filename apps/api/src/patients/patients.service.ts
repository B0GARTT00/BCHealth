import { ConflictException, Injectable } from '@nestjs/common';
import { PatientType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePatientDto, UpdatePatientDto } from './dto';

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
      return await this.prisma.patient.update({ where: { id }, data: dto });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('A patient with this ID or email already exists.');
      }
      throw error;
    }
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
      },
    });
  }
}
