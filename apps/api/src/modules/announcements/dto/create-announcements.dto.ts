import { IsEnum, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title!: string;

  @IsString()
  content!: string;

  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'])
  status!: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}
