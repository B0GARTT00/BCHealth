import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { AcademicService } from './academic.service';
import { CreateAcademicYearDto, CreateSemesterDto } from './dto';

type AuthenticatedRequest = Request & { user: { id: string } };

@ApiTags('academic-years')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('academic-years')
export class AcademicController {
  constructor(private readonly academic: AcademicService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  list() {
    return this.academic.list();
  }

  @Post()
  @Roles('ADMINISTRATOR')
  createYear(@Body() dto: CreateAcademicYearDto, @Req() request: AuthenticatedRequest) {
    return this.academic.createYear(dto, request.user.id);
  }

  @Post('semesters')
  @Roles('ADMINISTRATOR')
  createSemester(@Body() dto: CreateSemesterDto, @Req() request: AuthenticatedRequest) {
    return this.academic.createSemester(dto, request.user.id);
  }
}
