/**
 * Admin Service - Sistem yöneticisi iş mantığı.
 * Pending kullanıcı onay/red, üniversite CRUD, tüm dersler, istatistikler.
 */
import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UserStatus } from '../../common/constants/roles';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  // =============================================
  // Kullanıcı Onay Yönetimi
  // =============================================

  /** PENDING durumundaki tüm kullanıcıları listeler */
  async getPendingRequests() {
    return this.prisma.user.findMany({
      where: { status: UserStatus.PENDING },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        universityId: true,
        university: {
          select: { id: true, name: true, city: true },
        },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Kullanıcıyı onayla: status -> ACTIVE, üniversite -> isVerified: true */
  async approveUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { university: true },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    // Kullanıcı statüsünü ACTIVE yap
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.ACTIVE },
      select: { id: true, email: true, fullName: true, role: true, status: true },
    });

    // Eğer üniversite yetkilisiyse, üniversiteyi de onayla
    if (user.universityId && user.university) {
      await this.prisma.university.update({
        where: { id: user.universityId },
        data: { isVerified: true },
      });
      this.logger.log(`Üniversite onaylandı: ${user.university.name}`);
    }

    this.logger.log(`Kullanıcı onaylandı: ${updatedUser.email}`);
    return updatedUser;
  }

  /** Kullanıcıyı reddet: status -> REJECTED */
  async rejectUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.REJECTED },
      select: { id: true, email: true, fullName: true, role: true, status: true },
    });

    this.logger.log(`Kullanıcı reddedildi: ${updatedUser.email}`);
    return updatedUser;
  }

  // =============================================
  // Üniversite Yönetimi
  // =============================================

  /** Tüm üniversiteleri listeler (onaylı ve onaysız) */
  async getAllUniversities() {
    return this.prisma.university.findMany({
      include: {
        _count: { select: { courses: true, users: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Yeni üniversite ekler */
  async createUniversity(data: { name: string; city: string; website?: string; contactEmail?: string }) {
    const slug = this.generateSlug(data.name);

    return this.prisma.university.create({
      data: {
        name: data.name,
        slug,
        city: data.city,
        website: data.website,
        contactEmail: data.contactEmail,
        isVerified: true, // Admin oluşturduğu için direkt onaylı
      },
    });
  }

  /** Üniversite bilgilerini günceller */
  async updateUniversity(id: string, data: { name?: string; city?: string; website?: string; isVerified?: boolean }) {
    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) throw new NotFoundException('Üniversite bulunamadı');

    return this.prisma.university.update({
      where: { id },
      data,
    });
  }

  /** Üniversiteyi siler */
  async deleteUniversity(id: string) {
    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) throw new NotFoundException('Üniversite bulunamadı');

    await this.prisma.university.delete({ where: { id } });
    return { message: `${university.name} silindi` };
  }

  // =============================================
  // Ders Yönetimi (Tüm Dersler)
  // =============================================

  /** Tüm dersleri üniversite bilgisiyle birlikte listeler */
  async getAllCourses(page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take: limit,
        include: {
          university: {
            select: { id: true, name: true, city: true, slug: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count(),
    ]);

    return {
      data: courses,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /** Admin ders ekler (herhangi bir üniversiteye) */
  async createCourse(data: {
    code: string;
    name: string;
    ects: number;
    price?: number;
    isOnline?: boolean;
    description?: string;
    applicationUrl?: string;
    universityId: string;
  }) {
    return this.prisma.course.create({
      data: {
        code: data.code,
        name: data.name,
        ects: data.ects,
        price: data.price ?? null,
        isOnline: data.isOnline ?? false,
        description: data.description,
        applicationUrl: data.applicationUrl,
        universityId: data.universityId,
      },
      include: {
        university: { select: { name: true } },
      },
    });
  }

  /** Admin ders siler */
  async deleteCourse(id: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });
    if (!course) throw new NotFoundException('Ders bulunamadı');

    await this.prisma.course.delete({ where: { id } });
    return { message: `${course.name} silindi` };
  }

  // =============================================
  // İstatistikler (Dashboard)
  // =============================================

  /** Genel platform istatistikleri */
  async getDashboardStats() {
    const [
      totalCourses,
      totalUniversities,
      verifiedUniversities,
      totalUsers,
      pendingUsers,
      totalSearches,
      onlineCourses,
      todaySearches,
    ] = await Promise.all([
      this.prisma.course.count(),
      this.prisma.university.count(),
      this.prisma.university.count({ where: { isVerified: true } }),
      this.prisma.user.count(),
      this.prisma.user.count({ where: { status: UserStatus.PENDING } }),
      this.prisma.searchLog.count(),
      this.prisma.course.count({ where: { isOnline: true } }),
      this.prisma.searchLog.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

    return {
      totalCourses,
      totalUniversities,
      verifiedUniversities,
      totalUsers,
      pendingUsers,
      totalSearches,
      onlineCourses,
      todaySearches,
    };
  }

  /** Popüler aramalar */
  async getPopularSearches(limit: number = 10) {
    const results = await this.prisma.searchLog.groupBy({
      by: ['searchQuery'],
      where: { searchQuery: { not: null } },
      _count: { searchQuery: true },
      orderBy: { _count: { searchQuery: 'desc' } },
      take: limit,
    });
    return results.map((r: { searchQuery: string | null; _count: { searchQuery: number } }) => ({
      query: r.searchQuery,
      count: r._count.searchQuery,
    }));
  }

  /** Slug oluşturucu */
  private generateSlug(name: string): string {
    const turkishMap: Record<string, string> = {
      ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u',
      Ç: 'c', Ğ: 'g', İ: 'i', Ö: 'o', Ş: 's', Ü: 'u',
    };
    return name
      .split('')
      .map((char) => turkishMap[char] || char)
      .join('')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
}
