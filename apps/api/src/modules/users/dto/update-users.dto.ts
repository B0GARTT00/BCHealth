import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  displayName?: string;

  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
