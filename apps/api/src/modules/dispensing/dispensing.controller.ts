import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { DispensingService } from './dispensing.service';
import { CreateDispensingDto } from './dto';

@ApiTags('dispensing')
@Controller('dispensing')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class DispensingController {
  constructor(private readonly dispensingService: DispensingService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.CLINICAL_READ, Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Get all dispensing records' })
  findAll() {
    return this.dispensingService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.CLINICAL_READ, Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Get dispensing record by ID' })
  @ApiParam({ name: 'id', description: 'Dispensing record ID' })
  findOne(@Param('id') id: string) {
    return this.dispensingService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.CLINICAL_READ, Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Create a new dispensing record' })
  create(@Body() dto: CreateDispensingDto) {
    return this.dispensingService.create(dto);
  }
}
