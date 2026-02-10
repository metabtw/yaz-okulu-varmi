/**
 * Prisma Service - Veritabanı bağlantı yönetimi.
 * Uygulama genelinde tek bir Prisma Client instance'ı sağlar (Singleton).
 */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Veritabanı bağlantısı kuruldu');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Veritabanı bağlantısı kapatıldı');
  }
}
