import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateScreeningDto {
  @IsString()
  patientId!: string;

  @IsString()
  screeningType!: string;

  @IsOptional()
  @IsString()
  result?: string;

  @IsEnum(['PENDING', 'COMPLETED', 'FOLLOW_UP_REQUIRED'])
  status!: 'PENDING' | 'COMPLETED' | 'FOLLOW_UP_REQUIRED';

  @IsDateString()
  screenedAt!: string;

  @IsOptional()
  @IsString()
  screenedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
