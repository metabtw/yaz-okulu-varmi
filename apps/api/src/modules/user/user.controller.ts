/**
 * User Controller - Kullanıcı endpoint'leri.
 * GET /api/users/me    - Kendi profili
 * GET /api/users       - Tüm kullanıcılar (Admin)
 */
import { Controller, Get, UseGuards, Req, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles';
import { Request } from 'express';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  /** Giriş yapmış kullanıcının kendi profilini getirir */
  @Get('me')
  async getProfile(@Req() req: Request) {
    const user = req.user as { id: string };
    return this.userService.findById(user.id);
  }

  /** Admin: Tüm kullanıcıları listeler */
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.userService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }
}
