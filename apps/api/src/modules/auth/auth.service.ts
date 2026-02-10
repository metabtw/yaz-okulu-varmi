/**
 * Auth Service - Kullanıcı kaydı, girişi ve JWT token üretimi.
 * Üniversite yetkilisi kaydı: .edu.tr kontrolü + PENDING status.
 * Öğrenci kaydı: Doğrudan ACTIVE status.
 */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto, LoginDto } from './auth.dto';
import { Role, UserStatus } from '../../common/constants/roles';

/** JWT payload tipi */
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  status: string;
  universityId: string | null;
}

/** .edu.tr domain kontrolü için regex */
const EDU_TR_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu\.tr$/i;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Yeni kullanıcı kaydı oluşturur.
   * UNIVERSITY rolü: .edu.tr zorunlu, status = PENDING (admin onayı bekler)
   * STUDENT rolü: status = ACTIVE (hemen erişebilir)
   */
  async register(dto: RegisterDto) {
    // E-posta benzersizlik kontrolü
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Bu e-posta adresi zaten kayıtlı');
    }

    const role = dto.role || Role.STUDENT;

    // UNIVERSITY rolü: .edu.tr domain kontrolü
    if (role === Role.UNIVERSITY) {
      if (!EDU_TR_REGEX.test(dto.email)) {
        throw new BadRequestException(
          'Üniversite yetkilisi kaydı için .edu.tr uzantılı kurumsal e-posta adresi zorunludur',
        );
      }
    }

    // Status belirleme: Üniversite yetkilisi PENDING, diğerleri ACTIVE
    const status = role === Role.UNIVERSITY ? UserStatus.PENDING : UserStatus.ACTIVE;

    // Şifreyi hashle
    const passwordHash = await bcrypt.hash(dto.password, 12);

    // Üniversite yetkilisi için universityName'den üniversite oluştur veya bul
    let universityId = dto.universityId || null;

    if (role === Role.UNIVERSITY && dto.universityName && !universityId) {
      // E-posta domain'inden üniversite slug'ı oluştur
      const slug = this.generateSlug(dto.universityName);

      // Var mı kontrol et, yoksa oluştur
      let university = await this.prisma.university.findUnique({
        where: { slug },
      });

      if (!university) {
        university = await this.prisma.university.create({
          data: {
            name: dto.universityName,
            slug,
            city: dto.city || 'Belirtilmemiş',
            isVerified: false, // Admin onaylayana kadar false
          },
        });
        this.logger.log(`Yeni üniversite kaydı (onay bekliyor): ${university.name}`);
      }

      universityId = university.id;
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        fullName: dto.fullName,
        role,
        status,
        universityId,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        universityId: true,
        createdAt: true,
      },
    });

    this.logger.log(`Yeni kullanıcı kaydı: ${user.email} (${user.role}) [${user.status}]`);

    const token = this.generateToken(user.id, user.email, user.role, user.status, user.universityId);

    return {
      user,
      token,
      message: role === Role.UNIVERSITY
        ? 'Kaydınız alındı. Hesabınız admin onayı bekliyor.'
        : 'Kayıt başarılı.',
    };
  }

  /**
   * E-posta ve şifre ile giriş yapar, JWT token döner.
   * REJECTED kullanıcılar giriş yapamaz.
   */
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Geçersiz e-posta veya şifre');
    }

    // Reddedilen kullanıcılar giriş yapamaz
    if (user.status === UserStatus.REJECTED) {
      throw new ForbiddenException('Hesabınız reddedilmiştir. Lütfen yöneticiyle iletişime geçin.');
    }

    this.logger.log(`Kullanıcı girişi: ${user.email} [${user.status}]`);

    const token = this.generateToken(user.id, user.email, user.role, user.status, user.universityId);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        status: user.status,
        universityId: user.universityId,
      },
      token,
    };
  }

  /** JWT token üretir. */
  private generateToken(
    userId: string,
    email: string,
    role: string,
    status: string,
    universityId: string | null,
  ): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
      status,
      universityId,
    };
    return this.jwtService.sign(payload);
  }

  /** Türkçe uyumlu slug oluşturucu */
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
