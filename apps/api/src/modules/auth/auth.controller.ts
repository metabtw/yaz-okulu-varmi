/**
 * Auth Controller - Kimlik doğrulama endpoint'leri.
 * POST /api/auth/register - Yeni kullanıcı kaydı
 * POST /api/auth/login    - Kullanıcı girişi
 */
import { Controller, Post, Body, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterSchema, LoginSchema } from './auth.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import type { RegisterDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterSchema))
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
