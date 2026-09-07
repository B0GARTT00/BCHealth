import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EmergencyService } from './emergency.service';
import { CreateEmergencyDto, UpdateEmergencyDto } from './dto';

@ApiTags('emergency')
@Controller('emergency')
@UseGuards(AuthGuard('jwt'))
export class EmergencyController {
  constructor(private readonly emergencyService: EmergencyService) {}

  @Get()
  @ApiOperation({ summary: 'Get all emergency records' })
  findAll() {
    return this.emergencyService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get emergency record by ID' })
  @ApiParam({ name: 'id', description: 'Emergency record ID' })
  findOne(@Param('id') id: string) {
    return this.emergencyService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new emergency record' })
  create(@Body() dto: CreateEmergencyDto) {
    return this.emergencyService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update emergency record' })
  @ApiParam({ name: 'id', description: 'Emergency record ID' })
  update(@Param('id') id: string, @Body() dto: UpdateEmergencyDto) {
    return this.emergencyService.update(id, dto);
  }
}
