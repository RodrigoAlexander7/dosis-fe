import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { JwtPayload } from '../auth.service';

/**
 * JWT Strategy for validating JWT tokens
 * Automatically extracts and validates tokens from Authorization header
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor(
      private readonly configService: ConfigService,
      private readonly usersService: UsersService,
   ) {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: false,
         secretOrKey: configService.get<string>('AUTH_SECRET') || 'default-secret',
      });
   }

   /**
    * Validate JWT payload and attach user to request
    * This method is called automatically by Passport
    */
   async validate(payload: JwtPayload) {
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
         throw new UnauthorizedException('User not found');
      }

      if (!user.isActive) {
         throw new UnauthorizedException('User account is inactive');
      }

      // This will be available as req.user
      return {
         id: user.id,
         email: user.email,
         role: user.role,
      };
   }
}
