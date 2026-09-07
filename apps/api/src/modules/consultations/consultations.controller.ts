import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto, UpdateConsultationDto } from './dto';

@ApiTags('consultations')
@Controller('consultations')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get all consultations' })
  findAll() {
    return this.consultationsService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get consultation by ID' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  findOne(@Param('id') id: string) {
    return this.consultationsService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Create a new consultation' })
  create(@Body() dto: CreateConsultationDto) {
    return this.consultationsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Update consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  update(@Param('id') id: string, @Body() dto: UpdateConsultationDto) {
    return this.consultationsService.update(id, dto);
  }
}
