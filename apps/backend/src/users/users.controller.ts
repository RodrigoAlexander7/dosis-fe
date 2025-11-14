import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserRoleDto, UpdateUserStatusDto, UserResponseDto } from './dto/user.dto';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { CanManageRolesGuard } from '@/auth/guards/can-manage-roles.guard';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
   constructor(private readonly usersService: UsersService) { }

   /**
    * Get current authenticated user profile
    */
   @Get('me')
   @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
   @ApiResponse({
      status: 200,
      description: 'Perfil del usuario',
      type: UserResponseDto,
   })
   async getCurrentUser(@CurrentUser() user: any) {
      return this.usersService.findById(user.id);
   }

   /**
    * Update user role (admin or doctor can assign)
    */
   @Patch(':id/role')
   @UseGuards(CanManageRolesGuard)
   @ApiOperation({ summary: 'Asignar rol a un usuario (admin o doctores)' })
   @ApiResponse({
      status: 200,
      description: 'Rol actualizado exitosamente',
      type: UserResponseDto,
   })
   async updateUserRole(
      @Param('id') id: string,
      @Body() dto: UpdateUserRoleDto,
      @CurrentUser() currentUser: any,
   ) {
      return this.usersService.updateRole(id, dto.role as any);
   }

   /**
    * Activate or deactivate user account (admin or doctor can manage)
    */
   @Patch(':id/status')
   @UseGuards(CanManageRolesGuard)
   @ApiOperation({ summary: 'Activar/desactivar cuenta de usuario (admin o doctores)' })
   @ApiResponse({
      status: 200,
      description: 'Estado actualizado exitosamente',
      type: UserResponseDto,
   })
   async updateUserStatus(
      @Param('id') id: string,
      @Body() dto: UpdateUserStatusDto,
   ) {
      return this.usersService.updateActiveStatus(id, dto.isActive);
   }
}
