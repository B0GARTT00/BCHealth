import { IsDateString, IsString, IsOptional } from 'class-validator';

export class UpdateClinicVisitDto {
  @IsOptional()
  @IsString()
  visitType?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  visitedAt?: string;
}
