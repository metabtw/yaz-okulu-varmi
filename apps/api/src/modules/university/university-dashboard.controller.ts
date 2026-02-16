/**
 * University Dashboard Controller - Üniversite analitik endpoint'leri.
 * Tüm endpoint'ler JWT + UNIVERSITY rolü ile korunur.
 */
import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UniversityService } from './university.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles';
import type { Request } from 'express';

interface JwtUser {
  id: string;
  universityId: string | null;
}

@Controller('university')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.UNIVERSITY)
export class UniversityDashboardController {
  constructor(private readonly universityService: UniversityService) {}

  @Get('dashboard/overview')
  async getDashboardOverview(@Req() req: Request) {
    const user = req.user as JwtUser;
    if (!user.universityId) {
      throw new ForbiddenException('Üniversite bilgisi bulunamadı');
    }
    return this.universityService.getDashboardOverview(user.universityId);
  }

  @Get('dashboard/popular-courses')
  async getPopularCourses(
    @Req() req: Request,
    @Query('limit') limit?: string,
  ) {
    const user = req.user as JwtUser;
    if (!user.universityId) {
      throw new ForbiddenException('Üniversite bilgisi bulunamadı');
    }
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.universityService.getPopularCourses(
      user.universityId,
      parsedLimit,
    );
  }

  @Get('dashboard/time-series')
  async getTimeSeriesData(
    @Req() req: Request,
    @Query('days') days?: string,
  ) {
    const user = req.user as JwtUser;
    if (!user.universityId) {
      throw new ForbiddenException('Üniversite bilgisi bulunamadı');
    }
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.universityService.getTimeSeriesData(
      user.universityId,
      parsedDays,
    );
  }

  @Get('dashboard/course-stats')
  async getCourseStatusStats(@Req() req: Request) {
    const user = req.user as JwtUser;
    if (!user.universityId) {
      throw new ForbiddenException('Üniversite bilgisi bulunamadı');
    }
    return this.universityService.getCourseStatusStats(user.universityId);
  }
}
