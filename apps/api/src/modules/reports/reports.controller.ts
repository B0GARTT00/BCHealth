import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Get all reports summary' })
  findAll() {
    return {
      patients: this.reportsService.getPatientsReport(),
      visits: this.reportsService.getVisitsReport(),
      vaccinations: this.reportsService.getVaccinationsReport(),
      screenings: this.reportsService.getScreeningsReport(),
      inventory: this.reportsService.getInventoryReport(),
    };
  }

  @Get('patients')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Get patients report' })
  getPatientsReport() {
    return this.reportsService.getPatientsReport();
  }

  @Get('visits')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Get clinic visits report' })
  getVisitsReport() {
    return this.reportsService.getVisitsReport();
  }

  @Get('vaccinations')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Get vaccinations report' })
  getVaccinationsReport() {
    return this.reportsService.getVaccinationsReport();
  }

  @Get('screenings')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Get screenings report' })
  getScreeningsReport() {
    return this.reportsService.getScreeningsReport();
  }

  @Get('inventory')
  @Roles('ADMINISTRATOR', 'CLINIC_NURSE')
  @Permissions(Permission.REPORTS_READ)
  @ApiOperation({ summary: 'Get inventory report' })
  getInventoryReport() {
    return this.reportsService.getInventoryReport();
  }
}
