import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { AuditService } from './audit.service';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import { AuditAction } from '@prisma/client';

@ApiTags('audit-logs')
@Controller('audit-logs')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.AUDIT_READ)
  @ApiOperation({ summary: 'Get all audit logs (admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'action', required: false, enum: [
    'CREATE','UPDATE','DELETE','LOGIN','LOGOUT','LOGIN_FAILED','APPROVE','REJECT',
    'DISPENSE','EXPORT','ARCHIVE','RESTORE','LIST_USERS','VIEW_USER','CREATE_USER',
    'UPDATE_USER','DELETE_USER','ASSIGN_ROLE','ROLE_CHANGE','STATUS_CHANGE',
    'PASSWORD_CHANGE','PASSWORD_RESET','OTHER'
  ]})
  @ApiQuery({ name: 'entityType', required: false, type: String })
  @ApiQuery({ name: 'entityId', required: false, type: String })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  findAll(@Query() query: AuditLogQueryDto) {
    const page = query.page ? Number(query.page) : undefined;
    const limit = query.limit ? Number(query.limit) : undefined;

    return this.auditService.findAll({
      page,
      limit,
      userId: query.userId,
      action: query.action as AuditAction | undefined,
      entityType: query.entityType,
      entityId: query.entityId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
    });
  }

  @Get(':id')
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.AUDIT_READ)
  @ApiOperation({ summary: 'Get audit log by ID (admin only)' })
  @ApiParam({ name: 'id', description: 'Audit log ID' })
  findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }
}
