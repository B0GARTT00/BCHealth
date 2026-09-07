import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateHealthRequirementDto {
  @IsOptional()
  @IsString()
  requirementType?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'SUBMITTED', 'VERIFIED', 'MISSING'])
  status?: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'MISSING';

  @IsOptional()
  @IsDateString()
  submittedAt?: string;

  @IsOptional()
  @IsDateString()
  verifiedAt?: string;
}
