import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { ClearancesService } from './clearances.service';
import { CreateClearanceDto, UpdateClearanceDto } from './dto';

@ApiTags('clearances')
@Controller('clearances')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class ClearancesController {
  constructor(private readonly clearancesService: ClearancesService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.CLEARANCES_MANAGE)
  @ApiOperation({ summary: 'Get all clearances' })
  findAll() {
    return this.clearancesService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.CLEARANCES_MANAGE)
  @ApiOperation({ summary: 'Get clearance by ID' })
  @ApiParam({ name: 'id', description: 'Clearance ID' })
  findOne(@Param('id') id: string) {
    return this.clearancesService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.CLEARANCES_MANAGE)
  @ApiOperation({ summary: 'Create a new clearance' })
  create(@Body() dto: CreateClearanceDto) {
    return this.clearancesService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  @Permissions(Permission.CLEARANCES_MANAGE)
  @ApiOperation({ summary: 'Update clearance' })
  @ApiParam({ name: 'id', description: 'Clearance ID' })
  update(@Param('id') id: string, @Body() dto: UpdateClearanceDto) {
    return this.clearancesService.update(id, dto);
  }
}
