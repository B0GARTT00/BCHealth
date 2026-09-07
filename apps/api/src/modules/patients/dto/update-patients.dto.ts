import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class UpdatePatientDto {
  @IsOptional()
  @IsEnum(['STUDENT', 'FACULTY', 'STAFF'])
  type?: 'STUDENT' | 'FACULTY' | 'STAFF';

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  suffix?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  sex?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;
}
