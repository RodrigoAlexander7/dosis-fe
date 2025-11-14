import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { User, EnumRole } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

export interface CreateUserFromOAuthDto {
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
}

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Find user by email
   * @param email - User email address
   * @returns User entity or null
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });
  }

  /**
   * Find user by ID
   * @param id - User ID
   * @returns User entity or null
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Create user from OAuth provider
   * @param data - OAuth user data
   * @returns Created user entity
   */
  async createFromOAuth(data: CreateUserFromOAuthDto): Promise<User> {
    const { email, name, image, provider, providerId } = data;

    // Check if user is admin by email
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL');
    const isAdmin = email === adminEmail;

    return this.prisma.user.create({
      data: {
        email,
        name,
        image,
        isActive: true,
        role: isAdmin ? 'ADMIN' : null, // ADMIN auto-assigned, others by admin/doctor
        accounts: {
          create: {
            type: 'oauth',
            provider,
            providerAccountId: providerId,
          },
        },
      },
      include: {
        accounts: true,
      },
    });
  }

  /**
   * Update user role (admin only)
   * @param userId - User ID
   * @param role - New role
   * @returns Updated user
   */
  async updateRole(userId: string, role: EnumRole): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });
  }

  /**
   * Activate or deactivate user account
   * @param userId - User ID
   * @param isActive - Active status
   * @returns Updated user
   */
  async updateActiveStatus(userId: string, isActive: boolean): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }

  /**
   * Get all users (admin only)
   * @returns List of all users
   */
  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        accounts: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Get active medical staff (doctors and nurses)
   * @returns List of doctors and nurses
   */
  async findMedicalStaff(): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        role: {
          in: ['DOCTOR', 'NURSE'],
        },
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }
}
