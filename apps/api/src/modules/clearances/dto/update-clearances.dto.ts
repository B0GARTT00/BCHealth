import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateClearanceDto {
  @IsOptional()
  @IsString()
  clearanceType?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  status?: 'PENDING' | 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsDateString()
  approvedAt?: string;

  @IsOptional()
  @IsDateString()
  rejectedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
