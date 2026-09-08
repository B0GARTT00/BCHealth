import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryTransactionType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDispensationDto } from './dto';

@Injectable()
export class DispensingService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.medicineDispensation.findMany({ include: { patient: true, items: { include: { medicineBatch: { include: { medicine: true } } } } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  async create(dto: CreateDispensationDto, actorId: string) {
    const patient = await this.prisma.patient.findFirst({ where: { OR: [{ id: dto.patientId }, { patientNumber: dto.patientId }], deletedAt: null } });
    if (!patient) throw new NotFoundException('Active patient not found.');
    if (dto.clinicVisitId) {
      const visit = await this.prisma.clinicVisit.findUnique({ where: { id: dto.clinicVisitId } });
      if (!visit || visit.patientId !== patient.id) throw new NotFoundException('Clinic visit not found for this patient.');
    }

    const dispensation = await this.prisma.$transaction(async (transaction) => {
      for (const item of dto.items) {
        const changed = await transaction.medicineBatch.updateMany({ where: { id: item.medicineBatchId, quantity: { gte: item.quantity }, expiresAt: { gt: new Date() } }, data: { quantity: { decrement: item.quantity } } });
        if (changed.count !== 1) throw new BadRequestException('Insufficient stock or expired medicine batch.');
      }
      const record = await transaction.medicineDispensation.create({ data: { patientId: patient.id, clinicVisitId: dto.clinicVisitId, dispensedById: actorId, notes: dto.notes, items: { create: dto.items } }, include: { patient: true, items: { include: { medicineBatch: { include: { medicine: true } } } } } });
      for (const item of dto.items) {
        await transaction.inventoryTransaction.create({ data: { medicineBatchId: item.medicineBatchId, type: InventoryTransactionType.DISPENSE, quantity: -item.quantity, reason: `Dispensed to ${patient.patientNumber}`, actorId } });
      }
      return record;
    });
    await this.prisma.auditLog.create({ data: { actorId, action: 'MEDICINE_DISPENSED', entity: 'MedicineDispensation', entityId: dispensation.id } });
    return dispensation;
  }
}
