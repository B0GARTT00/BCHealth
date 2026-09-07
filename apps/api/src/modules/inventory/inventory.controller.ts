import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Get all inventory items' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Get inventory item by ID' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Create a new inventory item' })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.INVENTORY_MANAGE)
  @ApiOperation({ summary: 'Remove inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
