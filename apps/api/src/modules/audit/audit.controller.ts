import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { AuditService } from './audit.service';

@ApiTags('audit')
@Controller('audit')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.AUDIT_READ)
  @ApiOperation({ summary: 'Get all audit logs' })
  findAll() {
    return this.auditService.findAll();
  }

  @Get(':id')
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.AUDIT_READ)
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiParam({ name: 'id', description: 'Audit log ID' })
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }
}
