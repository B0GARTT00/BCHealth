import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateVaccinationDto {
  @IsString()
  patientId!: string;

  @IsString()
  vaccineName!: string;

  @IsInt()
  doseNumber!: number;

  @IsInt()
  @Min(1)
  totalDoses!: number;

  @IsDateString()
  administeredAt!: string;

  @IsOptional()
  @IsDateString()
  nextDoseAt?: string;

  @IsOptional()
  @IsString()
  administeredBy?: string;
}
