import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEmergencyCaseDto {
  @IsString()
  patientId!: string;

  @IsOptional()
  @IsString()
  clinicVisitId?: string;

  @IsDateString()
  occurredAt!: string;

  @IsString()
  emergencyType!: string;

  @IsString()
  description!: string;

  @IsString()
  actionTaken!: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsString()
  disposition?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
