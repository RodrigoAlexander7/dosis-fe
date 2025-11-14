import { Controller, Res, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Initiate Google OAuth flow
   * Redirects user to Google login page
   */
  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google')
  @ApiOperation({ summary: 'Iniciar flujo de autenticación con Google' })
  @ApiResponse({ status: 302, description: 'Redirección a Google OAuth' })
  async googleAuth() {
    // Guard redirects to Google
  }

  /**
   * Handle Google OAuth callback
   * After successful Google authentication, create/update user and return JWT
   */
  @Public()
  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  @ApiResponse({
    status: 302,
    description: 'Redirección al frontend con token JWT',
  })
  async googleAuthCallback(@Request() req, @Res() res: Response) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    try {
      const { accessToken, user } = await this.authService.handleGoogleLogin(
        req.user,
      );

      // Redirect to frontend with token
      res.redirect(
        `${frontendUrl}/auth/callback?token=${accessToken}&user=${encodeURIComponent(JSON.stringify(user))}`,
      );
    } catch (error) {
      console.error('Error during Google auth callback:', error);
      res.redirect(`${frontendUrl}/auth/error?message=${error.message}`);
    }
  }
}
