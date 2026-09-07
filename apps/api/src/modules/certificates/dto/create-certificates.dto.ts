import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsString()
  patientId!: string;

  @IsString()
  certificateType!: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsEnum(['PENDING', 'ISSUED', 'VERIFIED', 'EXPIRED'])
  status!: 'PENDING' | 'ISSUED' | 'VERIFIED' | 'EXPIRED';

  @IsOptional()
  @IsDateString()
  issuedAt?: string;

  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  issuedBy?: string;

  @IsOptional()
  @IsString()
  verificationCode?: string;
}
