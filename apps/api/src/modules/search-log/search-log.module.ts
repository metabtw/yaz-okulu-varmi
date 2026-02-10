/**
 * SearchLog Module - Akademik analiz için arama loglama modülü.
 * TÜBİTAK raporunda istatistiksel analiz verisi sağlar.
 */
import { Module } from '@nestjs/common';
import { SearchLogService } from './search-log.service';
import { SearchLogController } from './search-log.controller';

@Module({
  controllers: [SearchLogController],
  providers: [SearchLogService],
  exports: [SearchLogService],
})
export class SearchLogModule {}
