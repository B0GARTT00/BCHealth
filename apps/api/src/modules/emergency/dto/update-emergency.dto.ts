import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateEmergencyDto {
  @IsOptional()
  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priorityLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  @IsOptional()
  @IsEnum(['PENDING', 'TREATED', 'TRANSFERRED', 'DISCHARGED'])
  status?: 'PENDING' | 'TREATED' | 'TRANSFERRED' | 'DISCHARGED';

  @IsOptional()
  @IsString()
  chiefComplaint?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsDateString()
  attendedAt?: string;

  @IsOptional()
  @IsDateString()
  dischargedAt?: string;
}
