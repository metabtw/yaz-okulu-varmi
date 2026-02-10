/**
 * Widget Controller - Dış site entegrasyonu endpoint'i.
 * GET /api/widget/:univId - Üniversitenin ders listesini JSON olarak döner.
 * Public erişimli, CORS açık.
 */
import { Controller, Get, Param } from '@nestjs/common';
import { WidgetService } from './widget.service';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  /** Public: Üniversitenin widget verisini döner */
  @Get(':univId')
  async getWidgetData(@Param('univId') univId: string) {
    return this.widgetService.getWidgetData(univId);
  }
}
