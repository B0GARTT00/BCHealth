import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
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
  @ApiOperation({ summary: 'Get patients report' })
  getPatientsReport() {
    return this.reportsService.getPatientsReport();
  }

  @Get('visits')
  @ApiOperation({ summary: 'Get clinic visits report' })
  getVisitsReport() {
    return this.reportsService.getVisitsReport();
  }

  @Get('vaccinations')
  @ApiOperation({ summary: 'Get vaccinations report' })
  getVaccinationsReport() {
    return this.reportsService.getVaccinationsReport();
  }

  @Get('screenings')
  @ApiOperation({ summary: 'Get screenings report' })
  getScreeningsReport() {
    return this.reportsService.getScreeningsReport();
  }

  @Get('inventory')
  @ApiOperation({ summary: 'Get inventory report' })
  getInventoryReport() {
    return this.reportsService.getInventoryReport();
  }
}
