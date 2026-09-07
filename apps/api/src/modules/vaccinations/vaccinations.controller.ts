import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VaccinationsService } from './vaccinations.service';
import { CreateVaccinationDto, UpdateVaccinationDto } from './dto';

@ApiTags('vaccinations')
@Controller('vaccinations')
@UseGuards(AuthGuard('jwt'))
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all vaccinations' })
  findAll() {
    return this.vaccinationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vaccination by ID' })
  @ApiParam({ name: 'id', description: 'Vaccination ID' })
  findOne(@Param('id') id: string) {
    return this.vaccinationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new vaccination record' })
  create(@Body() dto: CreateVaccinationDto) {
    return this.vaccinationsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update vaccination record' })
  @ApiParam({ name: 'id', description: 'Vaccination ID' })
  update(@Param('id') id: string, @Body() dto: UpdateVaccinationDto) {
    return this.vaccinationsService.update(id, dto);
  }
}
