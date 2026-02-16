/**
 * Student Module - Öğrenci dashboard modülü.
 * Favoriler, arama geçmişi, öneriler ve istatistikler.
 */
import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';

@Module({
  controllers: [StudentController],
  providers: [StudentService],
  exports: [StudentService],
})
export class StudentModule {}
