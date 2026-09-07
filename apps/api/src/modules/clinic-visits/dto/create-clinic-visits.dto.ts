import { IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateClinicVisitDto {
  @IsString()
  patientId!: string;

  @IsString()
  visitType!: string;

  @IsString()
  status!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  visitedAt!: string;
}
