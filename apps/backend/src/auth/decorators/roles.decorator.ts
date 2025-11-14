import { SetMetadata } from '@nestjs/common';

/**
 * Roles decorator
 * Specifies which roles are allowed to access a route
 * Usage: @Roles('DOCTOR', 'NURSE')
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
