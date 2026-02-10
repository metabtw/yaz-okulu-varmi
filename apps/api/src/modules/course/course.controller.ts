/**
 * Course Controller - Ders endpoint'leri.
 * GET    /api/courses             - Ders arama (Public, filtreleme destekli)
 * GET    /api/courses/:id         - Ders detayı (Public)
 * POST   /api/university/courses  - Yeni ders ekle (University)
 * PATCH  /api/university/courses/:id - Ders güncelle (University)
 * DELETE /api/university/courses/:id - Ders sil (University)
 * GET    /api/university/courses  - Üniversitenin dersleri (University Dashboard)
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
  UsePipes,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from './course.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateCourseSchema, UpdateCourseSchema } from './course.dto';
import type { CreateCourseDto, UpdateCourseDto, SearchCoursesDto } from './course.dto';
import { Role } from '../../common/constants/roles';
import { Request } from 'express';
import * as crypto from 'crypto';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  /**
   * Public: Ders arama endpoint'i.
   * Filtreler query parameter olarak gönderilir.
   * Her arama SearchLog tablosuna kaydedilir.
   */
  @Get('courses')
  async search(@Query() query: SearchCoursesDto, @Req() req: Request) {
    // IP'yi anonimleştir (SHA-256 hash) - KVKK uyumluluğu
    const ip = req.ip || req.socket.remoteAddress || '';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    const userAgent = req.headers['user-agent'] || undefined;

    return this.courseService.search(query, ipHash, userAgent);
  }

  /** Public: Ders detayı */
  @Get('courses/:id')
  async findById(@Param('id') id: string) {
    return this.courseService.findById(id);
  }

  /** University: Kendi üniversitesinin derslerini listeler (Dashboard) */
  @Get('university/courses')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.UNIVERSITY)
  async findByUniversity(@Req() req: Request) {
    const user = req.user as { universityId: string | null };
    if (!user.universityId) {
      throw new ForbiddenException('Bir üniversiteye bağlı değilsiniz');
    }
    return this.courseService.findByUniversity(user.universityId);
  }

  /** University: Yeni ders ekler */
  @Post('university/courses')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.UNIVERSITY)
  @UsePipes(new ZodValidationPipe(CreateCourseSchema))
  async create(@Body() dto: CreateCourseDto, @Req() req: Request) {
    const user = req.user as { universityId: string | null };
    if (!user.universityId) {
      throw new ForbiddenException('Bir üniversiteye bağlı değilsiniz');
    }
    return this.courseService.create(dto, user.universityId);
  }

  /** University: Ders günceller */
  @Patch('university/courses/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.UNIVERSITY)
  @UsePipes(new ZodValidationPipe(UpdateCourseSchema))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
    @Req() req: Request,
  ) {
    const user = req.user as { universityId: string | null };
    if (!user.universityId) {
      throw new ForbiddenException('Bir üniversiteye bağlı değilsiniz');
    }
    return this.courseService.update(id, dto, user.universityId);
  }

  /** University: Ders siler */
  @Delete('university/courses/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.UNIVERSITY)
  async delete(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as { universityId: string | null };
    if (!user.universityId) {
      throw new ForbiddenException('Bir üniversiteye bağlı değilsiniz');
    }
    return this.courseService.delete(id, user.universityId);
  }
}
