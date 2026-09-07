import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateConsultationDto {
  @IsString()
  patientId!: string;

  @IsOptional()
  @IsString()
  clinicVisitId?: string;

  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  findings?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsDateString()
  consultedAt!: string;
}
