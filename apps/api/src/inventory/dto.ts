import { IsDateString, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateMedicineDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  genericName?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsString()
  dosageForm!: string;

  @IsString()
  unit!: string;

  @IsInt()
  @Min(0)
  reorderLevel!: number;
}

export class StockInDto {
  @IsString()
  medicineId!: string;

  @IsString()
  batchNumber!: string;

  @IsDateString()
  expiresAt!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  supplier?: string;
}
