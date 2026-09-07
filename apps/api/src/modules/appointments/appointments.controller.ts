import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dto';

@ApiTags('appointments')
@Controller('appointments')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF', 'DOCTOR')
  @Permissions(Permission.APPOINTMENTS_MANAGE)
  @ApiOperation({ summary: 'Get all appointments' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF', 'DOCTOR')
  @Permissions(Permission.APPOINTMENTS_MANAGE)
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.APPOINTMENTS_MANAGE)
  @ApiOperation({ summary: 'Create a new appointment' })
  create(@Body() dto: CreateAppointmentDto) {
    return this.appointmentsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.APPOINTMENTS_MANAGE)
  @ApiOperation({ summary: 'Update appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.appointmentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.APPOINTMENTS_MANAGE)
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
