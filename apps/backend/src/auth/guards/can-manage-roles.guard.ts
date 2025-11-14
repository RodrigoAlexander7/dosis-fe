import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard to check if user can manage roles (ADMIN or DOCTOR)
 */
@Injectable()
export class CanManageRolesGuard implements CanActivate {
   canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
         throw new ForbiddenException('Usuario no autenticado');
      }

      if (user.role !== 'ADMIN' && user.role !== 'DOCTOR') {
         throw new ForbiddenException('Acceso denegado. Solo administradores y doctores pueden asignar roles.');
      }

      return true;
   }
}
