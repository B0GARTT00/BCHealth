import { IsOptional, IsString } from 'class-validator';

export class UpdateDispensingDto {
  @IsOptional()
  @IsString()
  dispensedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
