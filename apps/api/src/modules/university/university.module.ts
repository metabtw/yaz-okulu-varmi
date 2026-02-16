/**
 * University Module - Üniversite yönetimi modülü.
 * Üniversite CRUD, profil yönetimi ve Admin onay işlemleri.
 */
import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { UniversityDashboardController } from './university-dashboard.controller';

@Module({
  controllers: [UniversityController, UniversityDashboardController],
  providers: [UniversityService],
  exports: [UniversityService],
})
export class UniversityModule {}
