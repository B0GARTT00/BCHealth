import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateConsultationDto {
  @IsOptional()
  @IsString()
  symptoms?: string;

  @IsOptional()
  @IsString()
  findings?: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  consultedAt?: string;
}
