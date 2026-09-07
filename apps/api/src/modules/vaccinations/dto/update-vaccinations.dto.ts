import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateVaccinationDto {
  @IsOptional()
  @IsString()
  vaccineName?: string;

  @IsOptional()
  @IsInt()
  doseNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalDoses?: number;

  @IsOptional()
  @IsDateString()
  administeredAt?: string;

  @IsOptional()
  @IsDateString()
  nextDoseAt?: string;

  @IsOptional()
  @IsString()
  administeredBy?: string;
}
