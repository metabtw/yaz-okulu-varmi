/**
 * Widget Service - Dış site entegrasyonu için ders verisi sağlar.
 * Üniversitenin kendi sitesine gömülen tablo/widget için JSON endpoint.
 * 
 * Widget Script: apps/web/public/widget/embed.js (Static)
 */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Widget API Response Interface */
export interface WidgetData {
  widgetId: string;
  universityName: string;
  theme: 'light' | 'dark' | 'auto';
  columns: string[];
  rows: Record<string, unknown>[];
  meta: {
    total: number;
    lastUpdated: string; // ISO 8601
  };
}

@Injectable()
export class WidgetService {
  private readonly logger = new Logger(WidgetService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Üniversitenin widget verisini döner.
   * Param: university ID veya slug (örn: istanbul-teknik-universitesi).
   * Format: WidgetData interface'ine uygun JSON
   */
  async getWidgetData(param: string): Promise<WidgetData> {
    const isSlug = param.includes('-');
    const university = await this.prisma.university.findFirst({
      where: isSlug ? { slug: param } : { id: param },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
        website: true,
        widgetConfig: true,
        isVerified: true,
        courses: {
          select: {
            id: true,
            code: true,
            name: true,
            ects: true,
            price: true,
            currency: true,
            isOnline: true,
            applicationUrl: true,
            startDate: true,
            endDate: true,
          },
          orderBy: { name: 'asc' },
        },
      },
    });

    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    if (!university.isVerified) {
      throw new NotFoundException('Bu üniversite henüz onaylanmamış');
    }

    this.logger.log(`Widget verisi istendi: ${university.name}`);

    // Widget config'den theme al veya varsayılan kullan
    const config = university.widgetConfig as { theme?: string } | null;
    const theme = (config?.theme as 'light' | 'dark' | 'auto') || 'auto';

    // Standart widget response formatı
    return {
      widgetId: university.id,
      universityName: university.name,
      theme,
      columns: ['code', 'name', 'ects', 'price', 'isOnline', 'applicationUrl'],
      rows: university.courses.map((course) => ({
        id: course.id,
        code: course.code,
        name: course.name,
        ects: course.ects,
        price: course.price ? Number(course.price) : null,
        currency: course.currency,
        isOnline: course.isOnline,
        applicationUrl: course.applicationUrl,
        startDate: course.startDate?.toISOString() || null,
        endDate: course.endDate?.toISOString() || null,
      })),
      meta: {
        total: university.courses.length,
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}
