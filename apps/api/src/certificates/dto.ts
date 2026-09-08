import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  patientId!: string;

  @IsString()
  type!: string;

  @IsString()
  purpose!: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  remarks?: string;
}
