import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard to check if user has ADMIN role
 */
@Injectable()
export class IsAdminGuard implements CanActivate {
   canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
         throw new ForbiddenException('Usuario no autenticado');
      }

      if (user.role !== 'ADMIN') {
         throw new ForbiddenException('Acceso denegado. Solo administradores.');
      }

      return true;
   }
}
