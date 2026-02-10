/**
 * Admin Controller - Tüm admin endpoint'leri.
 * Kullanıcı onayı, üniversite yönetimi, ders listeleme, istatistikler.
 * Tüm endpoint'ler ADMIN rolü ile korunur.
 */
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/constants/roles';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ---- Dashboard İstatistikleri ----

  @Get('dashboard')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('stats/popular')
  async getPopularSearches(@Query('limit') limit?: string) {
    return this.adminService.getPopularSearches(limit ? parseInt(limit, 10) : 10);
  }

  // ---- Kullanıcı Onay Yönetimi ----

  @Get('pending-requests')
  async getPendingRequests() {
    return this.adminService.getPendingRequests();
  }

  @Patch('users/:id/approve')
  async approveUser(@Param('id') id: string) {
    return this.adminService.approveUser(id);
  }

  @Patch('users/:id/reject')
  async rejectUser(@Param('id') id: string) {
    return this.adminService.rejectUser(id);
  }

  // ---- Üniversite Yönetimi ----

  @Get('universities')
  async getAllUniversities() {
    return this.adminService.getAllUniversities();
  }

  @Post('universities')
  async createUniversity(
    @Body() body: { name: string; city: string; website?: string; contactEmail?: string },
  ) {
    return this.adminService.createUniversity(body);
  }

  @Patch('universities/:id')
  async updateUniversity(
    @Param('id') id: string,
    @Body() body: { name?: string; city?: string; website?: string; isVerified?: boolean },
  ) {
    return this.adminService.updateUniversity(id, body);
  }

  @Delete('universities/:id')
  async deleteUniversity(@Param('id') id: string) {
    return this.adminService.deleteUniversity(id);
  }

  // ---- Ders Yönetimi ----

  @Get('courses')
  async getAllCourses(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAllCourses(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  @Post('courses')
  async createCourse(
    @Body() body: {
      code: string;
      name: string;
      ects: number;
      price?: number;
      isOnline?: boolean;
      description?: string;
      applicationUrl?: string;
      universityId: string;
    },
  ) {
    return this.adminService.createCourse(body);
  }

  @Delete('courses/:id')
  async deleteCourse(@Param('id') id: string) {
    return this.adminService.deleteCourse(id);
  }
}
