import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateHealthRequirementDto {
  @IsString()
  patientId!: string;

  @IsString()
  requirementType!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['PENDING', 'SUBMITTED', 'VERIFIED', 'MISSING'])
  status!: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'MISSING';

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  verifiedAt?: string;
}
