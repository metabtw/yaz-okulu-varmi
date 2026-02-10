/**
 * SearchLog Controller - İstatistik endpoint'leri (Sadece Admin).
 * GET /api/admin/stats/overview  - Genel istatistikler
 * GET /api/admin/stats/popular   - Popüler aramalar
 * GET /api/admin/stats/daily     - Günlük arama verileri
 */
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SearchLogService } from './search-log.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles';

@Controller('admin/stats')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class SearchLogController {
  constructor(private readonly searchLogService: SearchLogService) {}

  /** Genel platform istatistikleri */
  @Get('overview')
  async getOverview() {
    return this.searchLogService.getOverviewStats();
  }

  /** En popüler aramalar */
  @Get('popular')
  async getPopularSearches(@Query('limit') limit?: string) {
    return this.searchLogService.getPopularSearches(
      limit ? parseInt(limit, 10) : 10,
    );
  }

  /** Günlük arama verileri */
  @Get('daily')
  async getDailyStats(@Query('days') days?: string) {
    return this.searchLogService.getDailyStats(
      days ? parseInt(days, 10) : 30,
    );
  }
}
