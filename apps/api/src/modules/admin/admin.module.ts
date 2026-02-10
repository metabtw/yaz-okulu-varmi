/**
 * Admin Module - Sistem yöneticisi işlemleri.
 * Kullanıcı onayı, üniversite yönetimi, ders listeleme ve istatistikler.
 */
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
