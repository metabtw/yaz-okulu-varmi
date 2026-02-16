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
   * Param: university ID veya slug (örn: istanbul-teknik-universitesi).
   */
  async getWidgetData(param: string) {
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

    return {
      university: {
        name: university.name,
        logo: university.logo,
        website: university.website,
      },
      courses: university.courses,
      generatedAt: new Date().toISOString(),
    };
  }

  /** Widget embed script - dış sitelere gömülebilir */
  async getEmbedScript(): Promise<string> {
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    return `
(function() {
  'use strict';
  const WIDGET_API = '${apiUrl}/api/widget';
  const containers = document.querySelectorAll('[data-yaz-okulu-widget]');
  containers.forEach(async (container) => {
    const slug = container.getAttribute('data-university');
    const limit = container.getAttribute('data-limit') || '5';
    const sortBy = container.getAttribute('data-sort') || 'popular';
    if (!slug) { console.error('data-university gerekli'); return; }
    try {
      const res = await fetch(WIDGET_API + '/' + encodeURIComponent(slug) + '?limit=' + limit + '&sortBy=' + sortBy);
      const data = await res.json();
      const isDark = container.getAttribute('data-theme') === 'dark';
      const bg = isDark ? '#1a1a1a' : '#fff';
      const text = isDark ? '#fff' : '#000';
      const border = isDark ? '#333' : '#e5e7eb';
      let html = '<div style="font-family:system-ui;background:' + bg + ';color:' + text + ';border:1px solid ' + border + ';border-radius:8px;padding:20px;">';
      html += '<h3 style="margin:0 0 16px;font-size:18px;">' + data.university.name + ' - Yaz Okulu</h3>';
      (data.courses || []).forEach(function(c) {
        html += '<div style="border:1px solid ' + border + ';border-radius:6px;padding:12px;margin-bottom:12px;">';
        html += '<h4 style="margin:0 0 8px;font-size:14px;">' + c.name + '</h4>';
        html += '<p style="margin:0;font-size:12px;color:' + (isDark ? '#9ca3af' : '#6b7280') + ';">' + c.code + ' | ' + c.ects + ' AKTS | ' + (c.price != null ? c.price + ' ' + c.currency : 'Ücretsiz') + '</p>';
        if (c.applicationUrl) html += '<a href="' + c.applicationUrl + '" target="_blank" style="display:inline-block;margin-top:8px;padding:6px 12px;background:#3b82f6;color:#fff;border-radius:4px;text-decoration:none;font-size:12px;">Başvur</a>';
        html += '</div>';
      });
      html += '<p style="margin-top:16px;text-align:center;font-size:12px;"><a href="https://yazokuluvarmi.com" target="_blank" style="color:' + (isDark ? '#9ca3af' : '#6b7280') + ';">Tüm dersler →</a></p></div>';
      container.innerHTML = html;
    } catch (e) {
      container.innerHTML = '<p style="color:red;">Yaz okulu dersleri yüklenemedi.</p>';
    }
  });
})();
    `.trim();
  }
}
