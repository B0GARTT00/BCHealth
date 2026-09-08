import { Injectable } from '@nestjs/common';
import { AppointmentStatus, ClearanceStatus, RequirementStatus, VisitStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [patients, visitsToday, visitsCompleted, appointmentsUpcoming, pendingRequirements, clearancesForReview, medicines] = await Promise.all([
      this.prisma.patient.count({ where: { deletedAt: null } }),
      this.prisma.clinicVisit.count({ where: { visitDate: { gte: today, lt: tomorrow } } }),
      this.prisma.clinicVisit.count({ where: { status: VisitStatus.COMPLETED } }),
      this.prisma.appointment.count({ where: { scheduledAt: { gte: new Date() }, status: { in: [AppointmentStatus.PENDING, AppointmentStatus.APPROVED, AppointmentStatus.CONFIRMED] } } }),
      this.prisma.requirementSubmission.count({ where: { status: { in: [RequirementStatus.SUBMITTED, RequirementStatus.UNDER_REVIEW] } } }),
      this.prisma.clearance.count({ where: { status: ClearanceStatus.FOR_REVIEW } }),
      this.prisma.medicine.findMany({ where: { deletedAt: null }, include: { batches: true } }),
    ]);
    const lowStock = medicines.filter((medicine) => medicines.find((item) => item.id === medicine.id)!.batches.reduce((total, batch) => total + batch.quantity, 0) <= medicine.reorderLevel).length;
    return { patients, visitsToday, visitsCompleted, appointmentsUpcoming, pendingRequirements, clearancesForReview, medicines: medicines.length, lowStock };
  }
}
