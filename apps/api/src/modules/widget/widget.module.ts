/**
 * Widget Module - Dış siteler için Headless API.
 * Üniversitelerin kendi web sitelerine gömeceği ders tablosu verisi.
 * CORS açık, public endpoint.
 */
import { Module } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetController } from './widget.controller';

@Module({
  controllers: [WidgetController],
  providers: [WidgetService],
})
export class WidgetModule {}
