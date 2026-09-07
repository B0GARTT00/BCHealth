import { Controller, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DispensingService } from './dispensing.service';
import { CreateDispensingDto } from './dto';

@ApiTags('dispensing')
@Controller('dispensing')
@UseGuards(AuthGuard('jwt'))
export class DispensingController {
  constructor(private readonly dispensingService: DispensingService) {}

  @Get()
  @ApiOperation({ summary: 'Get all dispensing records' })
  findAll() {
    return this.dispensingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get dispensing record by ID' })
  @ApiParam({ name: 'id', description: 'Dispensing record ID' })
  findOne(@Param('id') id: string) {
    return this.dispensingService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new dispensing record' })
  create(@Body() dto: CreateDispensingDto) {
    return this.dispensingService.create(dto);
  }
}
