import { Injectable } from '@nestjs/common';
import { PatientsEntity } from './entities/patients.entity';
import { CreatePatientDto, UpdatePatientDto } from './dto';

@Injectable()
export class PatientsService {
  private patients: PatientsEntity[] = [];

  findAll(search?: string, page = 1, limit = 20) {
    let filtered = this.patients.filter((p) => !p.deletedAt);

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.firstName.toLowerCase().includes(term) ||
          p.lastName.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.patientNumber.toLowerCase().includes(term),
      );
    }

    const start = (page - 1) * limit;
    return filtered.slice(start, start + limit);
  }

  findOne(id: string) {
    const patient = this.patients.find((p) => p.id === id && !p.deletedAt);
    if (!patient) {
      throw new Error('Patient not found');
    }
    return patient;
  }

  create(dto: CreatePatientDto) {
    const patient = new PatientsEntity();
    patient.id = crypto.randomUUID();
    patient.patientNumber = dto.patientNumber;
    patient.type = dto.type;
    patient.firstName = dto.firstName;
    patient.lastName = dto.lastName;
    patient.email = dto.email;
    patient.middleName = dto.middleName;
    patient.suffix = dto.suffix;
    patient.phone = dto.phone;
    patient.address = dto.address;
    patient.sex = dto.sex;
    patient.dateOfBirth = dto.dateOfBirth;
    patient.createdAt = new Date();
    patient.updatedAt = new Date();
    this.patients.push(patient);
    return patient;
  }

  update(id: string, dto: UpdatePatientDto) {
    const index = this.patients.findIndex((p) => p.id === id && !p.deletedAt);
    if (index === -1) {
      throw new Error('Patient not found');
    }
    this.patients[index] = { ...this.patients[index], ...dto, updatedAt: new Date() };
    return this.patients[index];
  }
}
