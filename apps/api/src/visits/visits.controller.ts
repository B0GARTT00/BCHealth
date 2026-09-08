import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateConsultationDto, CreateVisitDto, CreateVitalSignDto, UpdateVisitStatusDto } from './dto';
import { VisitsService } from './visits.service';

type AuthenticatedRequest = Request & { user: { id: string } };

@ApiTags('clinic-visits')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('clinic-visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}

  @Get('queue')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  queue() {
    return this.visits.listQueue();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF')
  findOne(@Param('id') id: string) {
    return this.visits.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  create(@Body() dto: CreateVisitDto, @Req() request: AuthenticatedRequest) {
    return this.visits.create(dto, request.user.id);
  }

  @Post(':id/vital-signs')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  addVitalSigns(@Param('id') id: string, @Body() dto: CreateVitalSignDto, @Req() request: AuthenticatedRequest) {
    return this.visits.addVitalSigns(id, dto, request.user.id);
  }

  @Post(':id/consultation')
  @Roles('ADMINISTRATOR', 'DOCTOR', 'CLINIC_NURSE')
  addConsultation(@Param('id') id: string, @Body() dto: CreateConsultationDto, @Req() request: AuthenticatedRequest) {
    return this.visits.addConsultation(id, dto, request.user.id);
  }

  @Patch(':id/status')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateVisitStatusDto, @Req() request: AuthenticatedRequest) {
    return this.visits.updateStatus(id, dto.status, request.user.id);
  }
}
