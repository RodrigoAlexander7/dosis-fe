import { IsEmail, IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
   DOCTOR = 'DOCTOR',
   NURSE = 'NURSE',
}

export class UpdateUserRoleDto {
   @ApiProperty({
      description: 'User role',
      enum: UserRole,
      example: UserRole.DOCTOR,
   })
   @IsEnum(UserRole)
   role: UserRole;
}

export class UpdateUserStatusDto {
   @ApiProperty({
      description: 'User active status',
      example: true,
   })
   @IsBoolean()
   isActive: boolean;
}

export class UserResponseDto {
   @ApiProperty({ example: 'cuid123' })
   id: string;

   @ApiProperty({ example: 'doctor@example.com' })
   email: string;

   @ApiProperty({ example: 'Dr. John Doe' })
   name: string | null;

   @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
   image?: string | null;

   @ApiProperty({ enum: UserRole, example: UserRole.DOCTOR, required: false })
   role: UserRole | null;

   @ApiProperty({ example: true })
   isActive: boolean;

   @ApiProperty()
   createdAt: Date;

   @ApiProperty()
   updatedAt: Date;
}
