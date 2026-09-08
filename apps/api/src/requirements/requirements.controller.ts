import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RequirementStatus } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { CreateRequirementDto, CreateSubmissionDto, ReviewSubmissionDto } from './dto';
import { RequirementsService } from './requirements.service';

type AuthenticatedRequest = Request & { user: { id: string } };

@ApiTags('requirements')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('requirements')
export class RequirementsController {
  constructor(private readonly requirements: RequirementsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF', 'DOCTOR')
  listRequirements() {
    return this.requirements.listRequirements();
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  createRequirement(@Body() dto: CreateRequirementDto, @Req() request: AuthenticatedRequest) {
    return this.requirements.createRequirement(dto, request.user.id);
  }

  @Get('submissions')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF', 'DOCTOR')
  listSubmissions(@Query('status') status?: RequirementStatus) {
    return this.requirements.listSubmissions(status);
  }

  @Post('submissions')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'CLINIC_STAFF')
  submit(@Body() dto: CreateSubmissionDto, @Req() request: AuthenticatedRequest) {
    return this.requirements.submit(dto, request.user.id);
  }

  @Post('submissions/:id/review')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  review(@Param('id') id: string, @Body() dto: ReviewSubmissionDto, @Req() request: AuthenticatedRequest) {
    return this.requirements.review(id, dto, request.user.id);
  }
}
