import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ArchiveService } from './archive.service';
import { CreateArchiveDto, RestoreArchiveDto } from './dto';

@ApiTags('archive')
@Controller('archive')
@UseGuards(AuthGuard('jwt'))
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @Get()
  @ApiOperation({ summary: 'Get all archived records' })
  findAll() {
    return this.archiveService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get archived record by ID' })
  @ApiParam({ name: 'id', description: 'Archive record ID' })
  findOne(@Param('id') id: string) {
    return this.archiveService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Archive a record' })
  create(@Body() dto: CreateArchiveDto) {
    return this.archiveService.create(dto);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Restore an archived record' })
  @ApiParam({ name: 'id', description: 'Archive record ID' })
  restore(@Param('id') id: string, @Body() dto: RestoreArchiveDto) {
    return this.archiveService.restore(id, dto);
  }
}
