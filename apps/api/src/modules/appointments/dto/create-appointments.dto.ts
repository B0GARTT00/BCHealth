import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId!: string;

  @IsDateString()
  appointmentDate!: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsEnum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'])
  status!: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

  @IsOptional()
  @IsString()
  notes?: string;
}
