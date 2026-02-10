/**
 * Yaz Okulu Var mı? - NestJS Backend Giriş Noktası
 * Uygulamayı başlatır, global pipe ve filter'ları yapılandırır.
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Global prefix: tüm endpoint'ler /api altında (health check hariç)
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });

  // CORS ayarları - Frontend'in backend'e erişimi için
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 API sunucusu ${port} portunda çalışıyor`);
}

bootstrap();
