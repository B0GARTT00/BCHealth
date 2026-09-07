import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { HealthRequirementsService } from './health-requirements.service';
import { CreateHealthRequirementDto, UpdateHealthRequirementDto } from './dto';

@ApiTags('health-requirements')
@Controller('health-requirements')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class HealthRequirementsController {
  constructor(private readonly healthRequirementsService: HealthRequirementsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.REQUIREMENTS_MANAGE)
  @ApiOperation({ summary: 'Get all health requirements' })
  findAll() {
    return this.healthRequirementsService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.REQUIREMENTS_MANAGE)
  @ApiOperation({ summary: 'Get health requirement by ID' })
  @ApiParam({ name: 'id', description: 'Health requirement ID' })
  findOne(@Param('id') id: string) {
    return this.healthRequirementsService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.REQUIREMENTS_MANAGE)
  @ApiOperation({ summary: 'Create a new health requirement' })
  create(@Body() dto: CreateHealthRequirementDto) {
    return this.healthRequirementsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.REQUIREMENTS_MANAGE)
  @ApiOperation({ summary: 'Update health requirement' })
  @ApiParam({ name: 'id', description: 'Health requirement ID' })
  update(@Param('id') id: string, @Body() dto: UpdateHealthRequirementDto) {
    return this.healthRequirementsService.update(id, dto);
  }
}
