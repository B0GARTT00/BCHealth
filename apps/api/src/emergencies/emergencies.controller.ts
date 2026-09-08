import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateEmergencyCaseDto } from './dto';
import { EmergenciesService } from './emergencies.service';

type AuthenticatedRequest = Request & { user: { id: string } };

@ApiTags('emergencies')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('emergencies')
export class EmergenciesController {
  constructor(private readonly emergencies: EmergenciesService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  list() {
    return this.emergencies.list();
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  create(@Body() dto: CreateEmergencyCaseDto, @Req() request: AuthenticatedRequest) {
    return this.emergencies.create(dto, request.user.id);
  }
}
