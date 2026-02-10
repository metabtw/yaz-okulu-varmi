/**
 * Zod Validation Pipe - Gelen request body'yi Zod şeması ile doğrular.
 * NestJS'in built-in ValidationPipe yerine Zod kullanarak tip güvenliği sağlar.
 * Hatalı veri geldiğinde detaylı Türkçe hata mesajları döner.
 */
import {
  PipeTransform,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      // Zod şemasına göre doğrula ve dönüştür
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        // Zod hata mesajlarını okunabilir formata çevir
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        throw new BadRequestException({
          message: 'Validasyon hatası',
          errors: formattedErrors,
        });
      }

      throw new BadRequestException('Geçersiz veri formatı');
    }
  }
}
