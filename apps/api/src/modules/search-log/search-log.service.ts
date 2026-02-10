/**
 * SearchLog Service - Arama loglarını kaydeder ve istatistik sağlar.
 * Akademik makale için: Popüler aramalar, şehir dağılımı, zaman serisi analizi.
 */
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Arama logu girdi tipi */
interface SearchLogInput {
  searchQuery: string | null;
  filters: Record<string, string | boolean | number | undefined>;
  resultCount: number;
  ipHash: string | null;
  userAgent: string | null;
}

@Injectable()
export class SearchLogService {
  private readonly logger = new Logger(SearchLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Yeni arama logunu veritabanına kaydeder */
  async log(input: SearchLogInput) {
    return this.prisma.searchLog.create({
      data: {
        searchQuery: input.searchQuery,
        filters: input.filters as object, // PostgreSQL native JSON
        resultCount: input.resultCount,
        ipHash: input.ipHash,
        userAgent: input.userAgent,
      },
    });
  }

  /** Admin: Toplam arama sayısını döner */
  async getTotalSearchCount() {
    return this.prisma.searchLog.count();
  }

  /**
   * Admin: En popüler aramaları döner.
   * Akademik rapor için "En çok aranan dersler" istatistiği.
   */
  async getPopularSearches(limit: number = 10) {
    const results = await this.prisma.searchLog.groupBy({
      by: ['searchQuery'],
      where: { searchQuery: { not: null } },
      _count: { searchQuery: true },
      orderBy: { _count: { searchQuery: 'desc' } },
      take: limit,
    });

    return results.map((r) => ({
      query: r.searchQuery,
      count: r._count.searchQuery,
    }));
  }

  /**
   * Admin: Günlük arama istatistikleri.
   * Zaman serisi grafiği için veri sağlar.
   */
  async getDailyStats(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await this.prisma.searchLog.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, resultCount: true },
      orderBy: { createdAt: 'asc' },
    });

    // Günlük bazda gruplama
    const dailyMap = new Map<string, { count: number; totalResults: number }>();
    for (const log of logs) {
      const dateKey = log.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(dateKey) || { count: 0, totalResults: 0 };
      existing.count += 1;
      existing.totalResults += log.resultCount;
      dailyMap.set(dateKey, existing);
    }

    return Array.from(dailyMap.entries()).map(([date, stats]) => ({
      date,
      searchCount: stats.count,
      avgResults: Math.round(stats.totalResults / stats.count),
    }));
  }

  /** Admin: Genel platform istatistikleri */
  async getOverviewStats() {
    const [totalSearches, totalCourses, totalUniversities, todaySearches] =
      await Promise.all([
        this.prisma.searchLog.count(),
        this.prisma.course.count(),
        this.prisma.university.count({ where: { isVerified: true } }),
        this.prisma.searchLog.count({
          where: {
            createdAt: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
            },
          },
        }),
      ]);

    return {
      totalSearches,
      totalCourses,
      totalUniversities,
      todaySearches,
    };
  }
}
