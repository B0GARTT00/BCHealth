import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class DispensationItemDto {
  @IsString()
  medicineBatchId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreateDispensationDto {
  @IsString()
  patientId!: string;

  @IsOptional()
  @IsString()
  clinicVisitId?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DispensationItemDto)
  items!: DispensationItemDto[];
}
