/**
 * Ana uygulama modülü - Tüm feature modüllerini birleştirir.
 * NestJS'in Dependency Injection kök noktasıdır.
 */
import { Module, Controller, Get } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { UniversityModule } from './modules/university/university.module';
import { CourseModule } from './modules/course/course.module';
import { SearchLogModule } from './modules/search-log/search-log.module';
import { WidgetModule } from './modules/widget/widget.module';
import { AdminModule } from './modules/admin/admin.module';

/** Health Check endpoint - GET / */
@Controller()
class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'Yaz Okulu Var mı? API',
      timestamp: new Date().toISOString(),
    };
  }
}

@Module({
  imports: [
    // .env dosyasını global olarak yükle
    ConfigModule.forRoot({ isGlobal: true }),
    // Prisma veritabanı bağlantısı
    PrismaModule,
    // Feature modülleri
    AuthModule,
    UserModule,
    UniversityModule,
    CourseModule,
    SearchLogModule,
    WidgetModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
