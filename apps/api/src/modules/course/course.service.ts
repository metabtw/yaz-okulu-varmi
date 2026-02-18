/**
 * Course Service - Ders iş mantığı.
 * Akıllı arama (fuzzy matching), filtreleme ve üniversite bazlı CRUD.
 * Multitenancy: Üniversite yetkilisi yalnızca kendi derslerini yönetebilir.
 * 
 * Fuzzy Search: pg_trgm extension aktifse similarity() ile,
 * değilse token-tabanlı OR search ile arama yapılır.
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

/** Fuzzy search sonuç tipi - export edildi (controller return type için gerekli) */
export interface FuzzySearchResult {
  id: string;
  code: string;
  name: string;
  ects: number;
  price: unknown;
  currency: string;
  isOnline: boolean;
  description: string | null;
  applicationUrl: string | null;
  quota: number | null;
  startDate: Date | null;
  endDate: Date | null;
  applicationDeadline: Date | null;
  universityId: string;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  score?: number;
}

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);
  private readonly enableTrgm = process.env.ENABLE_TRGM === 'true';

  constructor(
    private readonly prisma: PrismaService,
    private readonly searchLogService: SearchLogService,
  ) {
    this.logger.log(`Fuzzy search mode: ${this.enableTrgm ? 'pg_trgm' : 'token-based'}`);
  }

  /**
   * Akıllı ders arama - Fuzzy matching, filtreleme ve sayfalama ile.
   * Her arama SearchLog tablosuna kaydedilir (Akademik analiz).
   * 
   * pg_trgm aktifse: similarity() fonksiyonu ile typo toleranslı arama
   * Fallback: Token-tabanlı OR search (kelime bazlı eşleşme)
   */
  async search(dto: SearchCoursesDto, ipHash?: string, userAgent?: string) {
    const page = parseInt(dto.page || '1', 10);
    const limit = Math.min(parseInt(dto.limit || '20', 10), 100); // Max 100 sonuç
    const skip = (page - 1) * limit;

    // Eğer metin araması varsa ve fuzzy search aktifse
    if (dto.q && this.enableTrgm) {
      return this.fuzzySearch(dto, skip, limit, page, ipHash, userAgent);
    }

    // Standart Prisma araması (fuzzy olmayan veya boş query)
    return this.standardSearch(dto, skip, limit, page, ipHash, userAgent);
  }

  /**
   * Fuzzy Search - pg_trgm ile typo toleranslı arama
   * "bilgisyr" -> "Bilgisayar", "imatematik" -> "Matematik"
   */
  private async fuzzySearch(
    dto: SearchCoursesDto,
    skip: number,
    limit: number,
    page: number,
    ipHash?: string,
    userAgent?: string,
  ) {
    // SQL injection koruması
    const sanitizedQuery = dto.q!.trim().replace(/[%_\\]/g, '\\$&');
    const similarityThreshold = 0.2; // 0-1 arası, düşük = daha toleranslı

    // Ek filtreler için koşulları oluştur
    const conditions: string[] = ['u."isVerified" = true'];
    const params: unknown[] = [sanitizedQuery, sanitizedQuery, similarityThreshold];
    let paramIndex = 4;

    // Şehir filtresi
    if (dto.city) {
      conditions.push(`u.city = $${paramIndex}`);
      params.push(dto.city);
      paramIndex++;
    }

    // Üniversite filtresi
    if (dto.universityId) {
      conditions.push(`c."universityId" = $${paramIndex}`);
      params.push(dto.universityId);
      paramIndex++;
    }

    // Online/Yüzyüze filtresi
    if (dto.isOnline !== undefined) {
      conditions.push(`c."isOnline" = $${paramIndex}`);
      params.push(dto.isOnline === 'true');
      paramIndex++;
    }

    // AKTS filtresi
    if (dto.minEcts) {
      conditions.push(`c.ects >= $${paramIndex}`);
      params.push(parseInt(dto.minEcts, 10));
      paramIndex++;
    }
    if (dto.maxEcts) {
      conditions.push(`c.ects <= $${paramIndex}`);
      params.push(parseInt(dto.maxEcts, 10));
      paramIndex++;
    }

    // Ücret filtresi
    if (dto.minPrice) {
      conditions.push(`c.price >= $${paramIndex}`);
      params.push(parseFloat(dto.minPrice));
      paramIndex++;
    }
    if (dto.maxPrice) {
      conditions.push(`c.price <= $${paramIndex}`);
      params.push(parseFloat(dto.maxPrice));
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    // Dinamik ORDER BY - sortBy ve sortOrder parametrelerine göre
    let orderByClause = 'score DESC, c.name ASC'; // Default: önce relevance, sonra isim
    
    if (dto.sortBy && dto.sortBy !== 'name') {
      // Kullanıcı özel sıralama istemişse, onu kullan (score'u kaldır)
      const sortColumn = dto.sortBy === 'startDate' ? 'c."startDate"' 
        : dto.sortBy === 'createdAt' ? 'c."createdAt"'
        : `c.${dto.sortBy}`;
      const sortDirection = dto.sortOrder || 'asc';
      orderByClause = `${sortColumn} ${sortDirection.toUpperCase()} NULLS LAST`;
    } else if (dto.sortBy === 'name') {
      const sortDirection = dto.sortOrder || 'asc';
      orderByClause = `c.name ${sortDirection.toUpperCase()}`;
    }

    try {
      // Fuzzy search with similarity scoring
      const courses = await this.prisma.$queryRawUnsafe<FuzzySearchResult[]>(`
        SELECT 
          c.*,
          GREATEST(similarity(c.name, $1), similarity(c.code, $2)) AS score,
          json_build_object(
            'id', u.id,
            'name', u.name,
            'slug', u.slug,
            'city', u.city,
            'logo', u.logo
          ) AS university
        FROM "Course" c
        JOIN "University" u ON c."universityId" = u.id
        WHERE ${whereClause}
          AND (
            similarity(c.name, $1) > $3
            OR similarity(c.code, $2) > $3
            OR c.name ILIKE '%' || $1 || '%'
            OR c.code ILIKE '%' || $2 || '%'
          )
        ORDER BY ${orderByClause}
        LIMIT ${limit} OFFSET ${skip}
      `, ...params);

      // Total count için ayrı sorgu
      const countResult = await this.prisma.$queryRawUnsafe<[{ count: bigint }]>(`
        SELECT COUNT(*) as count
        FROM "Course" c
        JOIN "University" u ON c."universityId" = u.id
        WHERE ${whereClause}
          AND (
            similarity(c.name, $1) > $3
            OR similarity(c.code, $2) > $3
            OR c.name ILIKE '%' || $1 || '%'
            OR c.code ILIKE '%' || $2 || '%'
          )
      `, ...params);

      const total = Number(countResult[0]?.count || 0);

      // Arama logu kaydet
      await this.logSearch(dto, total, ipHash, userAgent);

      return {
        data: courses,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          searchMode: 'fuzzy',
        },
      };
    } catch (error) {
      // pg_trgm hatası olursa fallback'e geç
      this.logger.warn('Fuzzy search hatası, fallback\'a geçiliyor:', error);
      return this.tokenSearch(dto, skip, limit, page, ipHash, userAgent);
    }
  }

  /**
   * Token-tabanlı OR Search - Fallback yöntemi
   * Arama terimini kelimelere bölüp her birini ayrı arar
   */
  private async tokenSearch(
    dto: SearchCoursesDto,
    skip: number,
    limit: number,
    page: number,
    ipHash?: string,
    userAgent?: string,
  ) {
    const query = dto.q || '';
    const tokens = query.split(/\s+/).filter(t => t.length > 1);

    // Base where koşulu
    const where: Prisma.CourseWhereInput = {
      university: { isVerified: true },
    };

    // Token bazlı OR arama
    if (tokens.length > 0) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { code: { contains: query, mode: 'insensitive' } },
        ...tokens.flatMap(token => [
          { name: { contains: token, mode: 'insensitive' as const } },
          { code: { contains: token, mode: 'insensitive' as const } },
        ]),
      ];
    }

    // Ek filtreler
    this.applyFilters(where, dto);

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [dto.sortBy || 'name']: dto.sortOrder || 'asc' },
        include: {
          university: {
            select: { id: true, name: true, slug: true, city: true, logo: true },
          },
        },
      }),
      this.prisma.course.count({ where }),
    ]);

    await this.logSearch(dto, total, ipHash, userAgent);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        searchMode: 'token',
      },
    };
  }

  /**
   * Standart Prisma araması - Query yoksa veya basit arama
   */
  private async standardSearch(
    dto: SearchCoursesDto,
    skip: number,
    limit: number,
    page: number,
    ipHash?: string,
    userAgent?: string,
  ) {
    // Prisma where koşullarını dinamik oluştur
    const where: Prisma.CourseWhereInput = {
      university: { isVerified: true },
    };

    // Metin araması (fuzzy değilse standart contains)
    if (dto.q) {
      where.OR = [
        { name: { contains: dto.q, mode: 'insensitive' } },
        { code: { contains: dto.q, mode: 'insensitive' } },
      ];
    }

    // Ek filtreler uygula
    this.applyFilters(where, dto);

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

    await this.logSearch(dto, total, ipHash, userAgent);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        searchMode: 'standard',
      },
    };
  }

  /**
   * Ortak filtre uygulama yöntemi
   */
  private applyFilters(where: Prisma.CourseWhereInput, dto: SearchCoursesDto) {
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
  }

  /**
   * Arama logunu kaydet (Akademik makale için istatistik verisi)
   */
  private async logSearch(
    dto: SearchCoursesDto,
    total: number,
    ipHash?: string,
    userAgent?: string,
  ) {
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
      this.logger.warn('Arama logu kaydedilemedi', error);
    }
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
