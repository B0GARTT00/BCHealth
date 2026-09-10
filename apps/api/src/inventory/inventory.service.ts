import { Injectable, NotFoundException } from '@nestjs/common';
import { InventoryTransactionType, AuditAction } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMedicineDto, StockInDto } from './dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async listMedicines() {
    const medicines = await this.prisma.medicine.findMany({ where: { deletedAt: null }, include: { batches: { orderBy: { expiresAt: 'asc' } } }, orderBy: { name: 'asc' } });
    return medicines.map((medicine) => ({ ...medicine, stock: medicine.batches.reduce((total, batch) => total + batch.quantity, 0), lowStock: medicine.batches.reduce((total, batch) => total + batch.quantity, 0) <= medicine.reorderLevel }));
  }

  async createMedicine(dto: CreateMedicineDto, actorId: string) {
    const medicine = await this.prisma.medicine.create({ data: dto });
    await this.audit(actorId, AuditAction.MEDICINE_CREATED, medicine.id);
    return medicine;
  }

  async stockIn(dto: StockInDto, actorId: string) {
    const medicine = await this.prisma.medicine.findUnique({ where: { id: dto.medicineId } });
    if (!medicine || medicine.deletedAt) throw new NotFoundException('Medicine not found.');
    const expiresAt = new Date(dto.expiresAt);
    const batch = await this.prisma.$transaction(async (transaction) => {
      const existing = await transaction.medicineBatch.findUnique({ where: { medicineId_batchNumber: { medicineId: dto.medicineId, batchNumber: dto.batchNumber } } });
      const updated = existing
        ? await transaction.medicineBatch.update({ where: { id: existing.id }, data: { quantity: { increment: dto.quantity }, expiresAt, supplier: dto.supplier } })
        : await transaction.medicineBatch.create({ data: { medicineId: dto.medicineId, batchNumber: dto.batchNumber, expiresAt, quantity: dto.quantity, supplier: dto.supplier } });
      await transaction.inventoryTransaction.create({ data: { medicineBatchId: updated.id, type: InventoryTransactionType.STOCK_IN, quantity: dto.quantity, actorId } });
      return updated;
    });
    await this.audit(actorId, AuditAction.MEDICINE_STOCKED_IN, batch.id);
    return batch;
  }

  listTransactions() {
    return this.prisma.inventoryTransaction.findMany({ include: { medicineBatch: { include: { medicine: true } } }, orderBy: { createdAt: 'desc' }, take: 100 });
  }

  private audit(actorId: string, action: AuditAction, entityId: string) {
    return this.prisma.auditLog.create({ data: { actorId, action, entity: 'Medicine', entityId } });
  }
}
