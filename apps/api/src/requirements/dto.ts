import { RequirementStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateRequirementDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  applicableTo!: string;

  @IsString()
  academicYearId!: string;

  @IsOptional()
  @IsString()
  semesterId?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}

export class CreateSubmissionDto {
  @IsString()
  requirementId!: string;

  @IsString()
  patientId!: string;

  @IsOptional()
  @IsString()
  documentId?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class ReviewSubmissionDto {
  @IsEnum(RequirementStatus)
  status!: RequirementStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
