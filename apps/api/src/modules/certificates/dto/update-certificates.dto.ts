import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateCertificateDto {
  @IsOptional()
  @IsString()
  certificateType?: string;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'ISSUED', 'VERIFIED', 'EXPIRED'])
  status?: 'PENDING' | 'ISSUED' | 'VERIFIED' | 'EXPIRED';

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
