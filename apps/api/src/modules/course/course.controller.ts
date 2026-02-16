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
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CourseService } from './course.service';
import { SearchParserService } from './search-parser.service';
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
  constructor(
    private readonly courseService: CourseService,
    private readonly searchParser: SearchParserService,
  ) {}

  /**
   * Public: Ders arama endpoint'i.
   * Filtreler query parameter olarak gönderilir.
   * q parametresi varsa Türkçe doğal dil parser ile filtreler çıkarılır.
   * Her arama SearchLog tablosuna kaydedilir.
   */
  @Get('courses')
  async search(@Query() query: SearchCoursesDto, @Req() req: Request) {
    let dto: SearchCoursesDto = { ...query };

    // q varsa doğal dil parser ile filtreleri zenginleştir
    if (query.q && query.q.trim().length > 0) {
      const parsed = await this.searchParser.parseQuery(query.q);
      // Manuel parametreler öncelikli; parser çıktısı eksik alanları doldurur
      if (parsed.city && !dto.city) dto.city = parsed.city;
      if (parsed.isOnline !== undefined && dto.isOnline === undefined) {
        dto.isOnline = parsed.isOnline ? 'true' : 'false';
      }
      if (parsed.minEcts !== undefined && !dto.minEcts) dto.minEcts = String(parsed.minEcts);
      if (parsed.maxEcts !== undefined && !dto.maxEcts) dto.maxEcts = String(parsed.maxEcts);
      if (parsed.minPrice !== undefined && !dto.minPrice) dto.minPrice = String(parsed.minPrice);
      if (parsed.maxPrice !== undefined && !dto.maxPrice) dto.maxPrice = String(parsed.maxPrice);
      if (parsed.q !== undefined && parsed.q.trim().length > 0) {
        dto.q = parsed.q;
      }
    }

    const ip = req.ip || req.socket.remoteAddress || '';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
    const userAgent = req.headers['user-agent'] || undefined;

    return this.courseService.search(dto, ipHash, userAgent);
  }

  /** Public: Ders karşılaştırma (2-4 ders) */
  @Get('courses/compare')
  async compareCourses(@Query('ids') ids: string) {
    if (!ids || typeof ids !== 'string') {
      throw new BadRequestException("Ders ID'leri gerekli");
    }
    const courseIds = ids
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    return this.courseService.compareCourses(courseIds);
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
  async create(@Body(new ZodValidationPipe(CreateCourseSchema)) dto: CreateCourseDto, @Req() req: Request) {
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
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCourseSchema)) dto: UpdateCourseDto,
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
