import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClearancesService } from './clearances.service';
import { CreateClearanceDto, UpdateClearanceDto } from './dto';

@ApiTags('clearances')
@Controller('clearances')
@UseGuards(AuthGuard('jwt'))
export class ClearancesController {
  constructor(private readonly clearancesService: ClearancesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clearances' })
  findAll() {
    return this.clearancesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clearance by ID' })
  @ApiParam({ name: 'id', description: 'Clearance ID' })
  findOne(@Param('id') id: string) {
    return this.clearancesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new clearance' })
  create(@Body() dto: CreateClearanceDto) {
    return this.clearancesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update clearance' })
  @ApiParam({ name: 'id', description: 'Clearance ID' })
  update(@Param('id') id: string, @Body() dto: UpdateClearanceDto) {
    return this.clearancesService.update(id, dto);
  }
}
