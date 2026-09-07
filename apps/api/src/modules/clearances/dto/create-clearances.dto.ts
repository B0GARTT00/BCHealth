import { IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateClearanceDto {
  @IsString()
  patientId!: string;

  @IsString()
  clearanceType!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsEnum(['PENDING', 'APPROVED', 'REJECTED'])
  status!: 'PENDING' | 'APPROVED' | 'REJECTED';

  @IsOptional()
  @IsString()
  notes?: string;
}
