import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto, UpdateConsultationDto } from './dto';

@ApiTags('consultations')
@Controller('consultations')
@UseGuards(AuthGuard('jwt'))
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all consultations' })
  findAll() {
    return this.consultationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consultation by ID' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  findOne(@Param('id') id: string) {
    return this.consultationsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new consultation' })
  create(@Body() dto: CreateConsultationDto) {
    return this.consultationsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update consultation' })
  @ApiParam({ name: 'id', description: 'Consultation ID' })
  update(@Param('id') id: string, @Body() dto: UpdateConsultationDto) {
    return this.consultationsService.update(id, dto);
  }
}
