/**
 * Course Module - Ders yönetimi ve arama modülü.
 * Üniversite yetkililerinin ders CRUD'u ve öğrencilerin akıllı arama işlemleri.
 */
import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { SearchParserService } from './search-parser.service';
import { SearchLogModule } from '../search-log/search-log.module';

@Module({
  imports: [SearchLogModule],
  controllers: [CourseController],
  providers: [CourseService, SearchParserService],
  exports: [CourseService],
})
export class CourseModule {}
