import { SetMetadata } from '@nestjs/common';

/**
 * Public route decorator
 * Marks routes that don't require authentication
 * Usage: @Public()
 */
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
