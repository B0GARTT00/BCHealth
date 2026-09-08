import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title!: string;

  @IsString()
  body!: string;

  @IsString()
  audience!: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}
