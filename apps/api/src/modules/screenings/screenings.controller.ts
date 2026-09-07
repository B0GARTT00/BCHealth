import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ScreeningsService } from './screenings.service';
import { CreateScreeningDto, UpdateScreeningDto } from './dto';

@ApiTags('screenings')
@Controller('screenings')
@UseGuards(AuthGuard('jwt'))
export class ScreeningsController {
  constructor(private readonly screeningsService: ScreeningsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all screenings' })
  findAll() {
    return this.screeningsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get screening by ID' })
  @ApiParam({ name: 'id', description: 'Screening ID' })
  findOne(@Param('id') id: string) {
    return this.screeningsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new screening' })
  create(@Body() dto: CreateScreeningDto) {
    return this.screeningsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update screening' })
  @ApiParam({ name: 'id', description: 'Screening ID' })
  update(@Param('id') id: string, @Body() dto: UpdateScreeningDto) {
    return this.screeningsService.update(id, dto);
  }
}
