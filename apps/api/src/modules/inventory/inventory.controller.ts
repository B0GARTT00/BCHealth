import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto } from './dto';

@ApiTags('inventory')
@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiOperation({ summary: 'Get all inventory items' })
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory item by ID' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new inventory item' })
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  update(@Param('id') id: string, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }
}
