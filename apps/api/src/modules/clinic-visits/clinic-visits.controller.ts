import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { ClinicVisitsService } from './clinic-visits.service';
import { CreateClinicVisitDto, UpdateClinicVisitDto } from './dto';

@ApiTags('clinic-visits')
@Controller('clinic-visits')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class ClinicVisitsController {
  constructor(private readonly clinicVisitsService: ClinicVisitsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get all clinic visits' })
  findAll() {
    return this.clinicVisitsService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get clinic visit by ID' })
  @ApiParam({ name: 'id', description: 'Clinic visit ID' })
  findOne(@Param('id') id: string) {
    return this.clinicVisitsService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Create a new clinic visit' })
  create(@Body() dto: CreateClinicVisitDto) {
    return this.clinicVisitsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Update clinic visit' })
  @ApiParam({ name: 'id', description: 'Clinic visit ID' })
  update(@Param('id') id: string, @Body() dto: UpdateClinicVisitDto) {
    return this.clinicVisitsService.update(id, dto);
  }
}
