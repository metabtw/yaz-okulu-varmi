/**
 * University Service - Üniversite iş mantığı.
 * Multitenancy: Üniversite yetkilisi sadece kendi verisini görebilir/değiştirebilir.
 * Admin: Tüm üniversiteleri yönetebilir ve onaylayabilir.
 */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUniversityDto, UpdateUniversityDto, WidgetConfigDto } from './university.dto';

@Injectable()
export class UniversityService {
  private readonly logger = new Logger(UniversityService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Yeni üniversite oluşturur.
   * Slug otomatik olarak isimden türetilir.
   */
  async create(dto: CreateUniversityDto) {
    // Slug oluştur: "İstanbul Teknik Üniversitesi" -> "istanbul-teknik-universitesi"
    const slug = this.generateSlug(dto.name);

    // Benzersizlik kontrolü
    const existing = await this.prisma.university.findFirst({
      where: { OR: [{ name: dto.name }, { slug }] },
    });
    if (existing) {
      throw new ConflictException('Bu üniversite adı zaten kayıtlı');
    }

    const university = await this.prisma.university.create({
      data: { ...dto, slug },
    });

    this.logger.log(`Yeni üniversite oluşturuldu: ${university.name}`);
    return university;
  }

  /** Tüm onaylı üniversiteleri listeler (public) */
  async findAllVerified() {
    return this.prisma.university.findMany({
      where: { isVerified: true },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        logo: true,
        website: true,
        _count: { select: { courses: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  /** Admin: Tüm üniversiteleri listeler (onaylanmamışlar dahil) */
  async findAll() {
    return this.prisma.university.findMany({
      include: {
        _count: { select: { courses: true, users: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Tek üniversiteyi ID ile getirir */
  async findById(id: string) {
    const university = await this.prisma.university.findUnique({
      where: { id },
      include: {
        courses: { orderBy: { name: 'asc' } },
        _count: { select: { courses: true } },
      },
    });

    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    return university;
  }

  /** Slug ile üniversite getirir (public URL'ler için) */
  async findBySlug(slug: string) {
    const university = await this.prisma.university.findUnique({
      where: { slug },
      include: {
        courses: { orderBy: { name: 'asc' } },
      },
    });

    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    return university;
  }

  /**
   * Üniversite bilgilerini günceller.
   * Multitenancy: Kullanıcının kendi üniversitesi olup olmadığını kontrol eder.
   */
  async update(id: string, dto: UpdateUniversityDto, requestingUniversityId?: string) {
    // Multitenancy kontrolü
    if (requestingUniversityId && requestingUniversityId !== id) {
      throw new ForbiddenException('Başka bir üniversitenin verilerini düzenleyemezsiniz');
    }

    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    const updated = await this.prisma.university.update({
      where: { id },
      data: dto,
    });

    this.logger.log(`Üniversite güncellendi: ${updated.name}`);
    return updated;
  }

  /** Admin: Üniversite hesabını onaylar */
  async verify(id: string) {
    const university = await this.prisma.university.findUnique({ where: { id } });
    if (!university) {
      throw new NotFoundException('Üniversite bulunamadı');
    }

    const verified = await this.prisma.university.update({
      where: { id },
      data: { isVerified: true },
    });

    this.logger.log(`Üniversite onaylandı: ${verified.name}`);
    return verified;
  }

  /** Widget konfigürasyonunu günceller */
  async updateWidgetConfig(id: string, config: WidgetConfigDto, requestingUniversityId?: string) {
    if (requestingUniversityId && requestingUniversityId !== id) {
      throw new ForbiddenException('Başka bir üniversitenin widget ayarlarını düzenleyemezsiniz');
    }

    return this.prisma.university.update({
      where: { id },
      data: { widgetConfig: JSON.stringify(config) },
    });
  }

  /**
   * Türkçe karakterleri ASCII'ye çevirip slug oluşturur.
   * "İstanbul Teknik Üniversitesi" -> "istanbul-teknik-universitesi"
   */
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
