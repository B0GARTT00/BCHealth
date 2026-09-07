import { IsOptional, IsString } from 'class-validator';

export class CreateArchiveDto {
  @IsString()
  recordType!: string;

  @IsString()
  recordId!: string;

  @IsString()
  data!: string;

  @IsOptional()
  @IsString()
  archivedBy?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}
