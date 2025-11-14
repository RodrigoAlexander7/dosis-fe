import {
   Body,
   Controller,
   Get,
   Param,
   Patch,
   UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { IsEnum, IsBoolean } from 'class-validator';
import { UsersService } from '../users.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { IsAdminGuard } from '../../auth/guards/is-admin.guard';
import { CanManageRolesGuard } from '../../auth/guards/can-manage-roles.guard';
import { EnumRole } from '@prisma/client';

class UpdateRoleDto {
   @IsEnum(EnumRole)
   role: EnumRole;
}

class UpdateStatusDto {
   @IsBoolean()
   isActive: boolean;
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
   constructor(private readonly usersService: UsersService) { }

   @Get('users')
   @UseGuards(CanManageRolesGuard)
   @ApiOperation({
      summary: 'Get all users',
      description: 'Retrieve list of all registered users. Accessible by administrators and doctors.',
   })
   @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
   @ApiResponse({ status: 403, description: 'Forbidden - Admin or Doctor access required' })
   async getAllUsers() {
      return this.usersService.findAll();
   }

   @Get('users/medical-staff')
   @UseGuards(CanManageRolesGuard)
   @ApiOperation({
      summary: 'Get active medical staff',
      description: 'Retrieve list of active doctors and nurses',
   })
   @ApiResponse({ status: 200, description: 'Medical staff retrieved successfully' })
   async getMedicalStaff() {
      return this.usersService.findMedicalStaff();
   }

   @Patch('users/:id/role')
   @UseGuards(CanManageRolesGuard)
   @ApiOperation({
      summary: 'Update user role',
      description: 'Assign DOCTOR, NURSE, or PATIENT role to a user. Accessible by administrators and doctors.',
   })
   @ApiResponse({ status: 200, description: 'Role updated successfully' })
   @ApiResponse({ status: 404, description: 'User not found' })
   @ApiResponse({ status: 403, description: 'Forbidden - Admin or Doctor access required' })
   async updateRole(
      @Param('id') userId: string,
      @Body() updateRoleDto: UpdateRoleDto,
   ) {
      return this.usersService.updateRole(userId, updateRoleDto.role);
   }

   @Patch('users/:id/status')
   @UseGuards(CanManageRolesGuard)
   @ApiOperation({
      summary: 'Update user active status',
      description: 'Activate or deactivate a user account. Accessible by administrators and doctors.',
   })
   @ApiResponse({ status: 200, description: 'Status updated successfully' })
   @ApiResponse({ status: 404, description: 'User not found' })
   @ApiResponse({ status: 403, description: 'Forbidden - Admin or Doctor access required' })
   async updateStatus(
      @Param('id') userId: string,
      @Body() updateStatusDto: UpdateStatusDto,
   ) {
      return this.usersService.updateActiveStatus(userId, updateStatusDto.isActive);
   }
}
