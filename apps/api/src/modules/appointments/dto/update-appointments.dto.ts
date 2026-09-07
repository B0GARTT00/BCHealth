import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  appointmentDate?: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsEnum(['SCHEDULED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'])
  status?: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';

  @IsOptional()
  @IsString()
  notes?: string;
}
