import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateScreeningDto {
  @IsOptional()
  @IsString()
  screeningType?: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  @IsEnum(['PENDING', 'COMPLETED', 'FOLLOW_UP_REQUIRED'])
  status?: 'PENDING' | 'COMPLETED' | 'FOLLOW_UP_REQUIRED';

  @IsOptional()
  @IsDateString()
  screenedAt?: string;

  @IsOptional()
  @IsString()
  screenedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
