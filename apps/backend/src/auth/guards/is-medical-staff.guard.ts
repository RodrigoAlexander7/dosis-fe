import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

/**
 * Guard to check if user is medical staff (doctor or nurse)
 */
@Injectable()
export class IsMedicalStaffGuard implements CanActivate {
   canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (!user) {
         throw new ForbiddenException('Usuario no autenticado');
      }

      if (user.role !== 'DOCTOR' && user.role !== 'NURSE') {
         throw new ForbiddenException('Acceso denegado. Solo personal médico (doctores y enfermeras).');
      }

      return true;
   }
}
