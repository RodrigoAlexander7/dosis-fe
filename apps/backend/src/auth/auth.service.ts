import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { ConfigService } from '@nestjs/config';

export interface GoogleProfile {
  name: string;
  email: string;
  image?: string;
  providerId: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string | null;
    image: string | null;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Handle Google OAuth callback and create/update user
   * @param profile - Google profile information
   * @returns JWT token and user information
   */
  async handleGoogleLogin(profile: GoogleProfile): Promise<AuthResponse> {
    const { email, name, image, providerId } = profile;

    if (!email) {
      throw new UnauthorizedException('Email not provided by Google');
    }

    // Find or create user
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      user = await this.usersService.createFromOAuth({
        email,
        name,
        image,
        provider: 'google',
        providerId,
      });
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    return {
      accessToken: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        role: user.role,
        image: user.image,
      },
    };
  }

  /**
   * Generate JWT token for authenticated user
   * @param user - User entity
   * @returns JWT token string
   */
  private generateToken(user: any): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role ?? undefined,
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Validate and decode JWT token
   * @param token - JWT token string
   * @returns Decoded JWT payload
   */
  async validateToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify<JwtPayload>(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
