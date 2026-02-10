/**
 * University Controller - Üniversite endpoint'leri.
 * GET    /api/universities          - Onaylı üniversiteler (Public)
 * GET    /api/universities/:id      - Üniversite detayı (Public)
 * POST   /api/universities          - Yeni üniversite oluştur (Admin)
 * PATCH  /api/universities/:id      - Üniversite güncelle (University/Admin)
 * PATCH  /api/admin/verify/:id      - Üniversite onayla (Admin)
 * PATCH  /api/universities/:id/widget - Widget ayarları (University)
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UniversityService } from './university.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import {
  CreateUniversitySchema,
  UpdateUniversitySchema,
  WidgetConfigSchema,
} from './university.dto';
import type {
  CreateUniversityDto,
  UpdateUniversityDto,
  WidgetConfigDto,
} from './university.dto';
import { Role } from '../../common/constants/roles';
import { Request } from 'express';

@Controller()
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  /** Public: Onaylı üniversiteleri listeler */
  @Get('universities')
  async findAllVerified() {
    return this.universityService.findAllVerified();
  }

  /** Public: Slug ile üniversite detayı */
  @Get('universities/slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.universityService.findBySlug(slug);
  }

  /** Public: ID ile üniversite detayı */
  @Get('universities/:id')
  async findById(@Param('id') id: string) {
    return this.universityService.findById(id);
  }

  /** Admin: Tüm üniversiteleri listeler */
  @Get('admin/universities')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async findAll() {
    return this.universityService.findAll();
  }

  /** Admin: Yeni üniversite oluşturur */
  @Post('universities')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async create(
    @Body(new ZodValidationPipe(CreateUniversitySchema)) dto: CreateUniversityDto,
  ) {
    return this.universityService.create(dto);
  }

  /** University/Admin: Üniversite bilgilerini günceller */
  @Patch('universities/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.UNIVERSITY, Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateUniversitySchema)) dto: UpdateUniversityDto,
    @Req() req: Request,
  ) {
    const user = req.user as { role: Role; universityId: string | null };
    const requestingUniversityId =
      user.role === Role.ADMIN ? undefined : user.universityId || undefined;
    return this.universityService.update(id, dto, requestingUniversityId);
  }

  /** Admin: Üniversite hesabını onaylar */
  @Patch('admin/verify/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  async verify(@Param('id') id: string) {
    return this.universityService.verify(id);
  }

  /** University: Widget konfigürasyonunu günceller */
  @Patch('universities/:id/widget')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.UNIVERSITY)
  async updateWidgetConfig(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(WidgetConfigSchema)) dto: WidgetConfigDto,
    @Req() req: Request,
  ) {
    const user = req.user as { universityId: string | null };
    return this.universityService.updateWidgetConfig(id, dto, user.universityId || undefined);
  }
}
