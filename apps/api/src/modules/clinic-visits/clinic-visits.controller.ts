import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ClinicVisitsService } from './clinic-visits.service';
import { CreateClinicVisitDto, UpdateClinicVisitDto } from './dto';

@ApiTags('clinic-visits')
@Controller('clinic-visits')
@UseGuards(AuthGuard('jwt'))
export class ClinicVisitsController {
  constructor(private readonly clinicVisitsService: ClinicVisitsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clinic visits' })
  findAll() {
    return this.clinicVisitsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get clinic visit by ID' })
  @ApiParam({ name: 'id', description: 'Clinic visit ID' })
  findOne(@Param('id') id: string) {
    return this.clinicVisitsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new clinic visit' })
  create(@Body() dto: CreateClinicVisitDto) {
    return this.clinicVisitsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update clinic visit' })
  @ApiParam({ name: 'id', description: 'Clinic visit ID' })
  update(@Param('id') id: string, @Body() dto: UpdateClinicVisitDto) {
    return this.clinicVisitsService.update(id, dto);
  }
}
