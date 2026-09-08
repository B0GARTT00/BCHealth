import { IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString, MinLength } from 'class-validator';

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
  @IsInt()
  yearLevel?: number;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  department?: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  patientNumber?: string;

  @IsOptional()
  @IsEnum(PatientTypeDto)
  type?: PatientTypeDto;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

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
  @IsInt()
  yearLevel?: number;

  @IsOptional()
  @IsString()
  program?: string;

  @IsOptional()
  @IsString()
  department?: string;
}

export class CreateEmergencyContactDto {
  @IsString()
  name!: string;

  @IsString()
  relationship!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class CreateMedicalHistoryDto {
  @IsString()
  summary!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateMedicalConditionDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsDateString()
  diagnosedAt?: string;

  @IsOptional()
  @IsDateString()
  resolvedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateAllergyDto {
  @IsString()
  allergen!: string;

  @IsOptional()
  @IsString()
  reaction?: string;

  @IsOptional()
  @IsString()
  severity?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
