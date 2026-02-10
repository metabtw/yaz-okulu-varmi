/**
 * Widget Service - Dış site entegrasyonu için ders verisi sağlar.
 * Üniversitenin kendi sitesine gömülen tablo/widget için JSON endpoint.
 */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WidgetService {
  private readonly logger = new Logger(WidgetService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Üniversitenin widget verisini döner.
   * Dersler + widget konfigürasyonu (renk, tema) birlikte gönderilir.
   */
  async getWidgetData(universityId: string) {
    const university = await this.prisma.university.findUnique({
      where: { id: universityId },
      select: {
        id: true,
        name: true,
        slug: true,
        logo: true,
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

    return {
      university: {
        id: university.id,
        name: university.name,
        slug: university.slug,
        logo: university.logo,
      },
      config: university.widgetConfig,
      courses: university.courses,
      totalCourses: university.courses.length,
      generatedAt: new Date().toISOString(),
    };
  }
}
