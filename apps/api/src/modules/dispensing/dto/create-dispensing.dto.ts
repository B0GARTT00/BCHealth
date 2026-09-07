import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateDispensingDto {
  @IsString()
  patientId!: string;

  @IsString()
  inventoryItemId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsDateString()
  dispensedAt!: string;

  @IsOptional()
  @IsString()
  dispensedBy?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
