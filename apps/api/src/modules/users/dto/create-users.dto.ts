import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '../../../auth/constants/roles';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  displayName!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
