import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto, UpdateScreeningDto } from './dto';

@ApiTags('screenings')
@Controller('screenings')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class ScreeningsController {
  constructor(private readonly screeningsService: ScreeningsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get all screenings' })
  findAll() {
    return this.screeningsService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get screening by ID' })
  @ApiParam({ name: 'id', description: 'Screening ID' })
  findOne(@Param('id') id: string) {
    return this.screeningsService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Create a new screening' })
  create(@Body() dto: CreateScreeningDto) {
    return this.screeningsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ, Permission.CLINICAL_MANAGE)
  @ApiOperation({ summary: 'Update screening' })
  @ApiParam({ name: 'id', description: 'Screening ID' })
  update(@Param('id') id: string, @Body() dto: UpdateScreeningDto) {
    return this.screeningsService.update(id, dto);
  }
}
