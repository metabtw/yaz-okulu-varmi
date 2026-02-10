/**
 * JWT Strategy - Passport.js ile JWT doğrulama stratejisi.
 * Her korumalı endpoint'e gelen token'ı doğrular ve kullanıcı bilgisini request'e ekler.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

/** JWT token içindeki veri yapısı */
interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  status: string;
  universityId: string | null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET') || 'fallback-secret-change-me',
    });
  }

  /**
   * Token doğrulandıktan sonra çalışır.
   * Dönen nesne request.user'a atanır.
   */
  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        universityId: true,
        fullName: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Kullanıcı bulunamadı');
    }

    return user;
  }
}
