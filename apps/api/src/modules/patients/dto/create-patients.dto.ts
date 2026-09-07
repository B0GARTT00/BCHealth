import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsDateString,
  Length,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @Length(1, 50)
  patientNumber!: string;

  @IsEnum(['STUDENT', 'FACULTY', 'STAFF'])
  type!: 'STUDENT' | 'FACULTY' | 'STAFF';

  @IsString()
  @Length(1, 100)
  firstName!: string;

  @IsString()
  @Length(1, 100)
  lastName!: string;

  @IsEmail()
  email!: string;

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
