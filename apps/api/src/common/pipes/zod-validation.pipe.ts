/**
 * Zod Validation Pipe - Gelen request body'yi Zod şeması ile doğrular.
 * NestJS'in built-in ValidationPipe yerine Zod kullanarak tip güvenliği sağlar.
 * Hatalı veri geldiğinde detaylı Türkçe hata mesajları döner.
 */
import {
  PipeTransform,
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ZodValidationPipe.name);

  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        this.logger.warn(
          `Validasyon hatası: ${JSON.stringify(formattedErrors)} | Gelen veri: ${JSON.stringify(value)}`,
        );

        throw new BadRequestException({
          message: 'Validasyon hatası',
          errors: formattedErrors,
        });
      }

      throw new BadRequestException('Geçersiz veri formatı');
    }
  }
}
