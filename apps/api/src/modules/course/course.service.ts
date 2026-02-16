/**
 * Course Service - Ders iş mantığı.
 * Akıllı arama, filtreleme ve üniversite bazlı CRUD.
 * Multitenancy: Üniversite yetkilisi yalnızca kendi derslerini yönetebilir.
 */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchLogService } from '../search-log/search-log.service';
import { CreateCourseDto, UpdateCourseDto, SearchCoursesDto } from './course.dto';
import type { Prisma } from '@prisma/client';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly searchLogService: SearchLogService,
  ) {}

  /**
   * Akıllı ders arama - Filtreleme ve sayfalama ile.
   * Her arama SearchLog tablosuna kaydedilir (Akademik analiz).
   */
  async search(dto: SearchCoursesDto, ipHash?: string, userAgent?: string) {
    const page = parseInt(dto.page || '1', 10);
    const limit = Math.min(parseInt(dto.limit || '20', 10), 100); // Max 100 sonuç
    const skip = (page - 1) * limit;

    // Prisma where koşullarını dinamik oluştur
    const where: Prisma.CourseWhereInput = {
      // Sadece onaylı üniversitelerin derslerini göster
      university: { isVerified: true },
    };

    // Metin araması (ders adı veya kodu) - PostgreSQL case-insensitive
    if (dto.q) {
      where.OR = [
        { name: { contains: dto.q, mode: 'insensitive' } },
        { code: { contains: dto.q, mode: 'insensitive' } },
      ];
    }

    // Şehir filtresi
    if (dto.city) {
      where.university = {
        ...where.university as Prisma.UniversityWhereInput,
        city: { equals: dto.city },
      };
    }

    // Üniversite filtresi
    if (dto.universityId) {
      where.universityId = dto.universityId;
    }

    // Online/Yüzyüze filtresi
    if (dto.isOnline !== undefined) {
      where.isOnline = dto.isOnline === 'true';
    }

    // AKTS aralığı filtresi
    if (dto.minEcts || dto.maxEcts) {
      where.ects = {};
      if (dto.minEcts) where.ects.gte = parseInt(dto.minEcts, 10);
      if (dto.maxEcts) where.ects.lte = parseInt(dto.maxEcts, 10);
    }

    // Ücret aralığı filtresi
    if (dto.minPrice || dto.maxPrice) {
      where.price = {};
      if (dto.minPrice) where.price.gte = parseFloat(dto.minPrice);
      if (dto.maxPrice) where.price.lte = parseFloat(dto.maxPrice);
    }

    // Sıralama
    const orderBy: Prisma.CourseOrderByWithRelationInput = {
      [dto.sortBy || 'name']: dto.sortOrder || 'asc',
    };

    // Sorguyu çalıştır
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          university: {
            select: { id: true, name: true, slug: true, city: true, logo: true },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    // Arama logunu kaydet (Akademik makale için istatistik verisi)
    try {
      await this.searchLogService.log({
        searchQuery: dto.q || null,
        filters: {
          city: dto.city,
          isOnline: dto.isOnline,
          minEcts: dto.minEcts,
          maxEcts: dto.maxEcts,
          minPrice: dto.minPrice,
          maxPrice: dto.maxPrice,
        },
        resultCount: total,
        ipHash: ipHash || null,
        userAgent: userAgent || null,
      });
    } catch (error) {
      // Log hatası arama sonuçlarını etkilememeli
      this.logger.warn('Arama logu kaydedilemedi', error);
    }

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /** Tek ders detayı getirir (public) */
  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        university: {
          select: { id: true, name: true, slug: true, city: true, logo: true, website: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Ders bulunamadı');
    }

    return course;
  }

  /**
   * Üniversite yetkilisi yeni ders ekler.
   * universityId otomatik olarak kullanıcının üniversitesinden alınır.
   */
  async create(dto: CreateCourseDto, universityId: string) {
    const course = await this.prisma.course.create({
      data: {
        ...dto,
        price: dto.price ?? null,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        universityId,
      },
      include: {
        university: { select: { name: true } },
      },
    });

    this.logger.log(
      `Yeni ders eklendi: ${course.name} (${course.code}) - ${course.university.name}`,
    );
    return course;
  }

  /**
   * Ders bilgilerini günceller.
   * Multitenancy: Sadece dersin ait olduğu üniversitenin yetkilisi güncelleyebilir.
   */
  async update(id: string, dto: UpdateCourseDto, universityId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Ders bulunamadı');
    }

    // Multitenancy kontrolü - Row Level Security mantığı
    if (course.universityId !== universityId) {
      throw new ForbiddenException('Bu ders başka bir üniversiteye aittir');
    }

    return this.prisma.course.update({
      where: { id },
      data: {
        ...dto,
        price: dto.price !== undefined ? (dto.price ?? null) : undefined,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  /**
   * Dersi siler.
   * Multitenancy: Sadece dersin ait olduğu üniversitenin yetkilisi silebilir.
   */
  async delete(id: string, universityId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) {
      throw new NotFoundException('Ders bulunamadı');
    }

    if (course.universityId !== universityId) {
      throw new ForbiddenException('Bu ders başka bir üniversiteye aittir');
    }

    await this.prisma.course.delete({ where: { id } });
    this.logger.log(`Ders silindi: ${course.name} (${course.code})`);

    return { message: 'Ders başarıyla silindi' };
  }

  /** Bir üniversitenin tüm derslerini listeler (Dashboard için) */
  async findByUniversity(universityId: string) {
    return this.prisma.course.findMany({
      where: { universityId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /**
   * Ders karşılaştırma - 2-4 ders seçilerek analiz ve tablo döner.
   * Fiyat, AKTS, online/yüz yüze, şehir dağılımı analizi.
   */
  async compareCourses(courseIds: string[]) {
    if (courseIds.length < 2) {
      throw new BadRequestException('En az 2 ders seçmelisiniz');
    }
    if (courseIds.length > 4) {
      throw new BadRequestException('En fazla 4 ders karşılaştırabilirsiniz');
    }

    const courses = await this.prisma.course.findMany({
      where: { id: { in: courseIds } },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            city: true,
            logo: true,
            website: true,
          },
        },
      },
      orderBy: { price: 'asc' },
    });

    if (courses.length !== courseIds.length) {
      throw new NotFoundException('Bazı dersler bulunamadı');
    }

    await this.prisma.course.updateMany({
      where: { id: { in: courseIds } },
      data: { viewCount: { increment: 1 } },
    });

    const prices = courses.map((c) => Number(c.price ?? 0));
    const ectsValues = courses.map((c) => c.ects);

    const analysis = {
      cheapest: courses.reduce((prev, curr) =>
        Number(curr.price ?? 0) < Number(prev.price ?? 0) ? curr : prev,
      ),
      mostExpensive: courses.reduce((prev, curr) =>
        Number(curr.price ?? 0) > Number(prev.price ?? 0) ? curr : prev,
      ),
      mostEcts: courses.reduce((prev, curr) =>
        curr.ects > prev.ects ? curr : prev,
      ),
      leastEcts: courses.reduce((prev, curr) =>
        curr.ects < prev.ects ? curr : prev,
      ),
      onlineCount: courses.filter((c) => c.isOnline).length,
      onsiteCount: courses.filter((c) => !c.isOnline).length,
      stats: {
        avgPrice:
          prices.reduce((a, b) => a + b, 0) / (prices.length || 1),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        avgEcts:
          ectsValues.reduce((a, b) => a + b, 0) / (ectsValues.length || 1),
        minEcts: Math.min(...ectsValues),
        maxEcts: Math.max(...ectsValues),
        totalCourses: courses.length,
      },
      cities: [...new Set(courses.map((c) => c.university.city))],
      cityCount: new Set(courses.map((c) => c.university.city)).size,
      universities: [...new Set(courses.map((c) => c.university.name))],
      universityCount: new Set(courses.map((c) => c.university.name)).size,
    };

    return {
      courses,
      analysis,
      comparedAt: new Date().toISOString(),
    };
  }
}
