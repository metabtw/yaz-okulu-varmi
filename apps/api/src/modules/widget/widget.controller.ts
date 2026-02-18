/**
 * Widget Controller - Dış site entegrasyonu endpoint'i.
 * GET /api/widget/:univId - Üniversitenin ders listesini JSON olarak döner.
 * Public erişimli, CORS açık.
 * 
 * NOT: embed.js artık Next.js static dosyası olarak sunuluyor:
 * apps/web/public/widget/embed.js
 */
import { Controller, Get, Param, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { WidgetService } from './widget.service';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  /**
   * [DEPRECATED] Widget embed script artık static dosyadan sunuluyor.
   * Geriye dönük uyumluluk için yönlendirme yapılıyor.
   */
  @Get('embed.js')
  getEmbedScript(@Res() res: Response) {
    // Static dosyaya yönlendir - Next.js'den sunuluyor
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(301, `${frontendUrl}/widget/embed.js`);
  }

  /**
   * Public: Üniversitenin widget verisini döner (ID veya slug)
   * CORS açık - dış sitelerden erişilebilir
   */
  @Get(':univId')
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Access-Control-Allow-Methods', 'GET, OPTIONS')
  @Header('Access-Control-Allow-Headers', 'Content-Type')
  @Header('Cache-Control', 'public, max-age=60')
  async getWidgetData(@Param('univId') univId: string) {
    return this.widgetService.getWidgetData(univId);
  }
}
