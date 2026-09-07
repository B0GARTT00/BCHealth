import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto, UpdateEmergencyDto } from './dto';

@ApiTags('emergency')
@Controller('emergency')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get all emergency records' })
  findAll() {
    return this.emergencyService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get emergency record by ID' })
  @ApiParam({ name: 'id', description: 'Emergency record ID' })
  findOne(@Param('id') id: string) {
    return this.emergencyService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Create a new emergency record' })
  create(@Body() dto: CreateEmergencyDto) {
    return this.emergencyService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Update emergency record' })
  @ApiParam({ name: 'id', description: 'Emergency record ID' })
  update(@Param('id') id: string, @Body() dto: UpdateEmergencyDto) {
    return this.emergencyService.update(id, dto);
  }
}
