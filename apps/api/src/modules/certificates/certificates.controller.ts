import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto, UpdateCertificateDto } from './dto';

@ApiTags('certificates')
@Controller('certificates')
@UseGuards(AuthGuard('jwt'))
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all certificates' })
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get certificate by ID' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new certificate' })
  create(@Body() dto: CreateCertificateDto) {
    return this.certificatesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update certificate' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.certificatesService.update(id, dto);
  }
}
