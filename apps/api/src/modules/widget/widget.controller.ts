/**
 * Widget Controller - Dış site entegrasyonu endpoint'i.
 * GET /api/widget/:univId - Üniversitenin ders listesini JSON olarak döner.
 * GET /api/widget/embed.js - Widget JavaScript dosyası.
 * Public erişimli, CORS açık.
 */
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { WidgetService } from './widget.service';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  /** Public: Widget embed script */
  @Get('embed.js')
  async getEmbedScript(@Res() res: Response) {
    const script = await this.widgetService.getEmbedScript();
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(script);
  }

  /** Public: Üniversitenin widget verisini döner (ID veya slug) */
  @Get(':univId')
  async getWidgetData(@Param('univId') univId: string) {
    return this.widgetService.getWidgetData(univId);
  }
}
