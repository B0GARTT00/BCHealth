import { IsOptional, IsString } from 'class-validator';

export class RestoreArchiveDto {
  @IsOptional()
  @IsString()
  restoredBy?: string;
}
