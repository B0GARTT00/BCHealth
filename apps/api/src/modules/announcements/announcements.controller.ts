import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto';

@ApiTags('announcements')
@Controller('announcements')
@UseGuards(AuthGuard('jwt'))
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all announcements' })
  findAll() {
    return this.announcementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  findOne(@Param('id') id: string) {
    return this.announcementsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new announcement' })
  create(@Body() dto: CreateAnnouncementDto) {
    return this.announcementsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete announcement' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  remove(@Param('id') id: string) {
    return this.announcementsService.remove(id);
  }
}
