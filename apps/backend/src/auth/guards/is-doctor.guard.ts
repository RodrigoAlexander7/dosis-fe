import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard to check if user is a doctor
 */
@Injectable()
export class IsDoctorGuard implements CanActivate {
   canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
         throw new ForbiddenException('Usuario no autenticado');
      }

      if (user.role !== 'DOCTOR') {
         throw new ForbiddenException('Acceso denegado. Solo doctores.');
      }

      return true;
   }
}
