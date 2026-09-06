import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export enum PatientTypeDto {
  STUDENT = 'STUDENT',
  FACULTY = 'FACULTY',
  STAFF = 'STAFF',
}

export class CreatePatientDto {
  @IsString()
  @MinLength(3)
  patientNumber!: string;

  @IsEnum(PatientTypeDto)
  type!: PatientTypeDto;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
