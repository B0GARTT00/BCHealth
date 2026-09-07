import { IsInt, IsString, Min } from 'class-validator';

export class CreateInventoryDto {
  @IsString()
  itemName!: string;

  @IsString()
  category!: string;

  @IsInt()
  quantity!: number;

  @IsString()
  unit!: string;

  @IsInt()
  @Min(0)
  reorderLevel!: number;
}
