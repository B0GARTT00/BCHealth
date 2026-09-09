import { CertificateType } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  patientId!: string;

  @IsEnum(CertificateType)
  type!: CertificateType;

  @IsString()
  purpose!: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
