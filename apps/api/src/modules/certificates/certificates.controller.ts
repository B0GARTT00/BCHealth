import { Controller, Get, Param, Post, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto, UpdateCertificateDto } from './dto';

@ApiTags('certificates')
@Controller('certificates')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class CertificatesController {
  constructor(private readonly certificatesService: CertificatesService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get all certificates' })
  findAll() {
    return this.certificatesService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Get certificate by ID' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  findOne(@Param('id') id: string) {
    return this.certificatesService.findOne(id);
  }

  @Post()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Create a new certificate' })
  create(@Body() dto: CreateCertificateDto) {
    return this.certificatesService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE', 'DOCTOR')
  @Permissions(Permission.CLINICAL_READ)
  @ApiOperation({ summary: 'Update certificate' })
  @ApiParam({ name: 'id', description: 'Certificate ID' })
  update(@Param('id') id: string, @Body() dto: UpdateCertificateDto) {
    return this.certificatesService.update(id, dto);
  }
}
