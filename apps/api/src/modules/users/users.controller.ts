import {
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Roles } from '../../common/roles.decorator';
import { RolesGuard } from '../../common/roles.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permission } from '../../auth/constants/permissions';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-users.dto';
import { UpdateUserDto } from './dto/update-users.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { Request } from 'express';

type AuthenticatedRequest = Request & { user: { id: string; roles: string[] } };

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.USERS_MANAGE)
  @ApiOperation({ summary: 'List system users' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'role', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String, enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'] })
  findAll(@Query() query: QueryUsersDto, @Req() req: AuthenticatedRequest) {
    return this.users.findAll(query, req.user.id, req.ip, req.get('user-agent'));
  }

  @Get(':id')
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.USERS_MANAGE)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.users.findOne(id, req.user.id, req.ip, req.get('user-agent'));
  }

  @Post()
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.USERS_MANAGE)
  @ApiOperation({ summary: 'Create a new system user' })
  create(@Body() dto: CreateUserDto, @Req() req: AuthenticatedRequest) {
    return this.users.create(dto, req.user.id, req.ip, req.get('user-agent'));
  }

  @Patch(':id')
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.USERS_MANAGE)
  @ApiOperation({ summary: 'Update user profile and status' })
  @ApiParam({ name: 'id', description: 'User ID' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: AuthenticatedRequest) {
    return this.users.update(id, dto, req.user.id, req.ip, req.get('user-agent'));
  }

  @Delete(':id')
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.USERS_MANAGE)
  @ApiOperation({ summary: 'Soft delete a system user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.users.softDelete(id, req.user.id, req.ip, req.get('user-agent'));
  }

  @Post(':id/roles')
  @Roles('ADMINISTRATOR')
  @Permissions(Permission.USERS_MANAGE)
  @ApiOperation({ summary: 'Assign or change a user role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto, @Req() req: AuthenticatedRequest) {
    return this.users.assignRole(id, dto.role, req.user.id, req.ip, req.get('user-agent'));
  }
}
