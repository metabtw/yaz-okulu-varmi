/**
 * University Service - Üniversite iş mantığı.
 * Multitenancy: Üniversite yetkilisi sadece kendi verisini görebilir/değiştirebilir.
 * Admin: Tüm üniversiteleri yönetebilir ve onaylayabilir.
 */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUniversityDto, UpdateUniversityDto, WidgetConfigDto } from './university.dto';

@Injectable()
export class UniversityService {
  private readonly logger = new Logger(UniversityService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Yeni üniversite oluşturur.
   * Slug otomatik olarak isimden türetilir.
   */
  async create(dto: CreateUniversityDto) {
    // Slug oluştur: "İstanbul Teknik Üniversitesi" -> "istanbul-teknik-universitesi"
    const slug = this.generateSlug(dto.name);

    // Benzersizlik kontrolü
    const existing = await this.prisma.university.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });
    if (existing) {
      throw new ConflictException('Bu üniversite adı zaten kayıtlı');
    }

    const university = await this.prisma.university.create({
      data: { ...dto, slug },
    });

    this.logger.log(`Yeni üniversite oluşturuldu: ${university.name}`);
    return university;
  }

  /** Tüm onaylı üniversiteleri listeler (public) */
  async findAllVerified() {
    return this.prisma.university.findMany({
      where: { isVerified: true },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        logo: true,
        website: true,
        _count: { select: { courses: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  /** Admin: Tüm üniversiteleri listeler (onaylanmamışlar dahil) */
  async findAll() {
    return this.prisma.university.findMany({
      include: {
        _count: { select: { courses: true, users: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Tek üniversiteyi ID ile getirir */
  async findById(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        courses: { orderBy: { name: 'asc' } },
        _count: { select: { courses: true } },
      },
    });

    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    return university;
  }

  /** Slug ile üniversite getirir (public URL'ler için) */
  async findBySlug(slug: string) {
    const university = await this.prisma.university.findUnique({
      where: { slug },
      include: {
        courses: { orderBy: { name: 'asc' } },
      },
    });

    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    return university;
  }

  /**
   * Üniversite bilgilerini günceller.
   * Multitenancy: Kullanıcının kendi üniversitesi olup olmadığını kontrol eder.
   */
  async update(id: string, dto: UpdateUniversityDto, requestingUniversityId?: string) {
    // Multitenancy kontrolü
    if (requestingUniversityId && requestingUniversityId !== id) {
      throw new ForbiddenException('Başka bir üniversitenin verilerini düzenleyemezsiniz');
    }

    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    const updated = await this.prisma.university.update({
      where: { id },
      data: dto,
    });

    this.logger.log(`Üniversite güncellendi: ${updated.name}`);
    return updated;
  }

  /** Admin: Üniversite hesabını onaylar */
  async verify(id: string) {
    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    const verified = await this.prisma.university.update({
      where: { id },
      data: { isVerified: true },
    });

    this.logger.log(`Üniversite onaylandı: ${verified.name}`);
    return verified;
  }

  /** Widget konfigürasyonunu günceller */
  async updateWidgetConfig(id: string, config: WidgetConfigDto, requestingUniversityId?: string) {
    if (requestingUniversityId && requestingUniversityId !== id) {
      throw new ForbiddenException('Başka bir üniversitenin widget ayarlarını düzenleyemezsiniz');
    }

    return this.prisma.university.update({
      where: { id },
      data: { widgetConfig: config as object }, // PostgreSQL native JSON desteği
    });
  }

  // ═════════════════════════════════════════════════════════════════════
  // ÜNİVERSİTE DASHBOARD ANALİTİKLERİ
  // ═════════════════════════════════════════════════════════════════════

  /** Genel bakış kartları - ders sayısı, görüntülenme, favori, başvuru tıklama */
  async getDashboardOverview(universityId: string) {
    const totalCourses = await this.prisma.course.count({
      where: { universityId },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newCoursesLastMonth = await this.prisma.course.count({
      where: {
        universityId,
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const totalViewsResult = await this.prisma.course.aggregate({
      where: { universityId },
      _sum: { viewCount: true },
    });
    const totalViews = totalViewsResult._sum.viewCount || 0;

    const recentViews = await this.prisma.userInteraction.count({
      where: {
        actionType: 'VIEW',
        createdAt: { gte: thirtyDaysAgo },
        course: { universityId },
      },
    });

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const previousViews = await this.prisma.userInteraction.count({
      where: {
        actionType: 'VIEW',
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        course: { universityId },
      },
    });

    const viewsChangePercent =
      previousViews > 0 ? ((recentViews - previousViews) / previousViews) * 100 : 0;

    const totalFavorites = await this.prisma.userFavorite.count({
      where: { course: { universityId } },
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentFavorites = await this.prisma.userFavorite.count({
      where: {
        createdAt: { gte: sevenDaysAgo },
        course: { universityId },
      },
    });

    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const previousFavorites = await this.prisma.userFavorite.count({
      where: {
        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        course: { universityId },
      },
    });

    const favoritesChangePercent =
      previousFavorites > 0
        ? ((recentFavorites - previousFavorites) / previousFavorites) * 100
        : 0;

    const totalApplicationClicks = await this.prisma.userInteraction.count({
      where: {
        actionType: 'APPLY',
        course: { universityId },
      },
    });

    const recentApplicationClicks = await this.prisma.userInteraction.count({
      where: {
        actionType: 'APPLY',
        createdAt: { gte: sevenDaysAgo },
        course: { universityId },
      },
    });

    const previousApplicationClicks = await this.prisma.userInteraction.count({
      where: {
        actionType: 'APPLY',
        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
        course: { universityId },
      },
    });

    const applicationsChangePercent =
      previousApplicationClicks > 0
        ? ((recentApplicationClicks - previousApplicationClicks) /
            previousApplicationClicks) *
          100
        : 0;

    return {
      totalCourses,
      newCoursesLastMonth,
      totalViews,
      recentViews,
      viewsChangePercent: Math.round(viewsChangePercent * 10) / 10,
      totalFavorites,
      recentFavorites,
      favoritesChangePercent: Math.round(favoritesChangePercent * 10) / 10,
      totalApplicationClicks,
      recentApplicationClicks,
      applicationsChangePercent: Math.round(applicationsChangePercent * 10) / 10,
    };
  }

  /** Popüler dersler tablosu - viewCount, favori, başvuru tıklama, dönüşüm oranı */
  async getPopularCourses(universityId: string, limit = 10) {
    const courses = await this.prisma.course.findMany({
      where: { universityId },
      select: {
        id: true,
        name: true,
        code: true,
        ects: true,
        price: true,
        currency: true,
        isOnline: true,
        viewCount: true,
        _count: { select: { favoritedBy: true } },
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
    });

    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const applicationClicks = await this.prisma.userInteraction.count({
          where: {
            courseId: course.id,
            actionType: 'APPLY',
          },
        });

        const conversionRate =
          course.viewCount > 0
            ? (applicationClicks / course.viewCount) * 100
            : 0;

        return {
          id: course.id,
          name: course.name,
          code: course.code,
          ects: course.ects,
          price: course.price,
          currency: course.currency,
          isOnline: course.isOnline,
          viewCount: course.viewCount,
          favoriteCount: course._count.favoritedBy,
          applicationClicks,
          conversionRate: Math.round(conversionRate * 10) / 10,
        };
      }),
    );

    return coursesWithStats;
  }

  /** Zaman serisi verileri - son N gün günlük görüntülenme, favori, başvuru */
  async getTimeSeriesData(universityId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyViews = (await this.prisma.$queryRaw`
      SELECT DATE(ui."createdAt") as date, COUNT(*)::int as count
      FROM "UserInteraction" ui
      INNER JOIN "Course" c ON c.id = ui."courseId"
      WHERE c."universityId" = ${universityId}
        AND ui."actionType" = 'VIEW'
        AND ui."createdAt" >= ${startDate}
      GROUP BY DATE(ui."createdAt")
      ORDER BY date ASC
    `) as Array<{ date: Date; count: number }>;

    const dailyFavorites = (await this.prisma.$queryRaw`
      SELECT DATE(uf."createdAt") as date, COUNT(*)::int as count
      FROM "UserFavorite" uf
      INNER JOIN "Course" c ON c.id = uf."courseId"
      WHERE c."universityId" = ${universityId}
        AND uf."createdAt" >= ${startDate}
      GROUP BY DATE(uf."createdAt")
      ORDER BY date ASC
    `) as Array<{ date: Date; count: number }>;

    const dailyApplications = (await this.prisma.$queryRaw`
      SELECT DATE(ui."createdAt") as date, COUNT(*)::int as count
      FROM "UserInteraction" ui
      INNER JOIN "Course" c ON c.id = ui."courseId"
      WHERE c."universityId" = ${universityId}
        AND ui."actionType" = 'APPLY'
        AND ui."createdAt" >= ${startDate}
      GROUP BY DATE(ui."createdAt")
      ORDER BY date ASC
    `) as Array<{ date: Date; count: number }>;

    const allDates: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (days - i - 1));
      allDates.push(d.toISOString().split('T')[0]);
    }

    const formatData = (
      data: Array<{ date: Date; count: number }>,
      dates: string[],
    ) => {
      const map = new Map(
        data.map((d) => [
          new Date(d.date).toISOString().split('T')[0],
          Number(d.count),
        ]),
      );
      return dates.map((date) => ({
        date,
        count: map.get(date) || 0,
      }));
    };

    return {
      dailyViews: formatData(dailyViews, allDates),
      dailyFavorites: formatData(dailyFavorites, allDates),
      dailyApplications: formatData(dailyApplications, allDates),
    };
  }

  /** Ders sağlık durumu - başvuru linki, tarih bilgisi eksiklikleri */
  async getCourseStatusStats(universityId: string) {
    const courses = await this.prisma.course.findMany({
      where: { universityId },
      select: {
        applicationUrl: true,
        startDate: true,
        endDate: true,
        isOnline: true,
      },
    });

    const stats = {
      total: courses.length,
      withApplicationUrl: courses.filter((c) => c.applicationUrl).length,
      withoutApplicationUrl: courses.filter((c) => !c.applicationUrl).length,
      withDates: courses.filter((c) => c.startDate && c.endDate).length,
      withoutDates: courses.filter((c) => !c.startDate || !c.endDate).length,
      online: courses.filter((c) => c.isOnline).length,
      onsite: courses.filter((c) => !c.isOnline).length,
    };

    const healthScore =
      stats.total > 0
        ? Math.round(
            ((stats.withApplicationUrl + stats.withDates) / (stats.total * 2)) *
              100,
          )
        : 0;

    return { ...stats, healthScore };
  }

  /**
   * Türkçe karakterleri ASCII'ye çevirip slug oluşturur.
   * "İstanbul Teknik Üniversitesi" -> "istanbul-teknik-universitesi"
   */
  private generateSlug(name: string): string {
    const turkishMap: Record<string, string> = {
      ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
      Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u',
    };

    return name
      .split('')
      .map((char) => turkishMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
