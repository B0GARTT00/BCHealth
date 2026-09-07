import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto';

@ApiTags('announcements')
@Controller('announcements')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF', 'STUDENT', 'FACULTY_STAFF')
  @ApiOperation({ summary: 'Get all announcements' })
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR', 'CLINIC_STAFF', 'STUDENT', 'FACULTY_STAFF')
  @ApiOperation({ summary: 'Get announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Create a new announcement' })
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Update announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Delete announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
