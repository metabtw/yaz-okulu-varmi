/**
 * Student Service - Öğrenci dashboard iş mantığı.
 * Favoriler, arama geçmişi, öneriler ve istatistikler.
 * Multitenancy: Her öğrenci sadece kendi verisine erişir.
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class StudentService {
  private readonly logger = new Logger(StudentService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Öğrenci profil bilgisi (User + University ilişkisi varsa) */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        email: true,
        department: true,
        preferredCities: true,
        university: {
          select: { id: true, name: true, city: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return {
      ...user,
      preferredCities: (user.preferredCities as string[]) ?? undefined,
    };
  }

  /** Öğrenci istatistikleri */
  async getStats(userId: string) {
    const [totalSearches, totalFavorites, totalInteractions, searchLogs, interactions] =
      await Promise.all([
        this.prisma.searchLog.count({ where: { userId } }),
        this.prisma.userFavorite.count({ where: { userId } }),
        this.prisma.userInteraction.count({ where: { userId } }),
        this.prisma.searchLog.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 100,
        }),
        this.prisma.userInteraction.findMany({
          where: { userId },
          include: { course: true },
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),
      ]);

    // En çok arama yapılan şehir (filters.city)
    const cityCounts: Record<string, number> = {};
    for (const log of searchLogs) {
      const filters = log.filters as Record<string, unknown> | null;
      const city = filters?.city as string | undefined;
      if (city) {
        cityCounts[city] = (cityCounts[city] || 0) + 1;
      }
    }
    const topSearchedCity =
      Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    // Ortalama ilgilenilen AKTS
    let avgEctsInterest = 0;
    if (interactions.length > 0) {
      const sum = interactions.reduce((s, i) => s + i.course.ects, 0);
      avgEctsInterest = Math.round((sum / interactions.length) * 10) / 10;
    }

    const lastSearch = await this.prisma.searchLog.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    return {
      totalSearches,
      totalFavorites,
      totalInteractions,
      topSearchedCity,
      avgEctsInterest,
      lastSearchDate: lastSearch?.createdAt ?? null,
    };
  }

  /** Favori dersler listesi */
  async getFavorites(userId: string) {
    const favorites = await this.prisma.userFavorite.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            university: {
              select: { id: true, name: true, slug: true, city: true, logo: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return favorites.map((f) => f.course);
  }

  /** Favoriye ders ekle */
  async addFavorite(userId: string, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw new NotFoundException('Ders bulunamadı');
    }

    const existing = await this.prisma.userFavorite.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      throw new ConflictException('Bu ders zaten favorilerinizde');
    }

    await this.prisma.userFavorite.create({
      data: { userId, courseId },
    });

    this.logger.log(`Favori eklendi: userId=${userId}, courseId=${courseId}`);
    return { message: 'Favorilere eklendi' };
  }

  /** Favoriden ders çıkar */
  async removeFavorite(userId: string, courseId: string) {
    const fav = await this.prisma.userFavorite.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!fav) {
      throw new NotFoundException('Favori bulunamadı');
    }

    await this.prisma.userFavorite.delete({
      where: { id: fav.id },
    });

    this.logger.log(`Favori kaldırıldı: userId=${userId}, courseId=${courseId}`);
    return { message: 'Favorilerden kaldırıldı' };
  }

  /** Arama geçmişi (son 10) */
  async getSearchHistory(userId: string, limit = 10) {
    return this.prisma.searchLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /** Ders etkileşimleri (VIEW, FAVORITE, APPLY) */
  async getInteractions(userId: string, limit = 20) {
    return this.prisma.userInteraction.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            university: {
              select: { id: true, name: true, city: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /** Ders görüntüleme/etkileşim kaydı */
  async recordInteraction(
    userId: string,
    courseId: string,
    actionType: 'VIEW' | 'FAVORITE' | 'APPLY',
  ) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) {
      throw new NotFoundException('Ders bulunamadı');
    }

    if (actionType === 'VIEW') {
      await this.prisma.course.update({
        where: { id: courseId },
        data: { viewCount: { increment: 1 } },
      });
    }

    await this.prisma.userInteraction.create({
      data: { userId, courseId, actionType },
    });
    return { message: 'Kaydedildi' };
  }

  /** Önerilen dersler - etkileşimlere göre benzer dersler */
  async getRecommendations(userId: string, take = 5) {
    const interactions = await this.prisma.userInteraction.findMany({
      where: { userId },
      include: { course: { include: { university: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const viewedCourseIds = interactions.map((i) => i.courseId);

    if (interactions.length === 0) {
      // Etkileşim yoksa popüler dersleri dön
      return this.prisma.course.findMany({
        where: { university: { isVerified: true } },
        include: {
          university: {
            select: { id: true, name: true, slug: true, city: true, logo: true },
          },
        },
        orderBy: { viewCount: 'desc' },
        take,
      });
    }

    const cities = [...new Set(interactions.map((i) => i.course.university.city))];
    const avgEcts =
      interactions.reduce((s, i) => s + i.course.ects, 0) / interactions.length;

    const where: Prisma.CourseWhereInput = {
      id: { notIn: viewedCourseIds },
      university: {
        isVerified: true,
        ...(cities.length > 0 ? { city: { in: cities } } : {}),
      },
      ects: {
        gte: Math.max(1, Math.floor(avgEcts - 2)),
        lte: Math.min(30, Math.ceil(avgEcts + 2)),
      },
    };

    const recommendations = await this.prisma.course.findMany({
      where,
      include: {
        university: {
          select: { id: true, name: true, slug: true, city: true, logo: true },
        },
      },
      take,
    });

    if (recommendations.length < take) {
      const extra = await this.prisma.course.findMany({
        where: {
          university: { isVerified: true },
          id: { notIn: [...viewedCourseIds, ...recommendations.map((r) => r.id)] },
        },
        include: {
          university: {
            select: { id: true, name: true, slug: true, city: true, logo: true },
          },
        },
        take: take - recommendations.length,
      });
      return [...recommendations, ...extra];
    }

    return recommendations;
  }
}
