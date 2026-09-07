import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto, UpdateVaccinationDto } from './dto';

@ApiTags('vaccinations')
@Controller('vaccinations')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get all vaccinations' })
  findAll() {
    return this.vaccinationsService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get vaccination by ID' })
  @ApiParam({ name: 'id', description: 'Vaccination ID' })
  findOne(@Param('id') id: string) {
    return this.vaccinationsService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Create a new vaccination record' })
  create(@Body() dto: CreateVaccinationDto) {
    return this.vaccinationsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Update vaccination record' })
  @ApiParam({ name: 'id', description: 'Vaccination ID' })
  update(@Param('id') id: string, @Body() dto: UpdateVaccinationDto) {
    return this.vaccinationsService.update(id, dto);
  }
}
