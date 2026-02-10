/**
 * University DTO'ları - Zod validasyon şemaları.
 * Üniversite oluşturma, güncelleme ve widget konfigürasyonu.
 */
import { z } from 'zod';

// ---- Üniversite Oluşturma ----

export const CreateUniversitySchema = z.object({
  name: z
    .string()
    .min(3, 'Üniversite adı en az 3 karakter olmalıdır')
    .max(200),
  city: z
    .string()
    .min(2, 'Şehir adı en az 2 karakter olmalıdır')
    .max(100),
  logo: z.union([z.string().url('Geçerli bir URL giriniz'), z.literal('')]).optional(),
  website: z.union([z.string().url('Geçerli bir URL giriniz'), z.literal('')]).optional(),
  contactEmail: z.union([z.string().email('Geçerli bir e-posta giriniz'), z.literal('')]).optional(),
});

export type CreateUniversityDto = z.infer<typeof CreateUniversitySchema>;

// ---- Üniversite Güncelleme ----

export const UpdateUniversitySchema = z.object({
  name: z.string().min(3).max(200).optional(),
  city: z.string().min(2).max(100).optional(),
  logo: z.union([z.string().url(), z.literal('')]).nullable().optional(),
  website: z.union([z.string().url(), z.literal('')]).nullable().optional(),
  contactEmail: z.union([z.string().email(), z.literal('')]).nullable().optional(),
});

export type UpdateUniversityDto = z.infer<typeof UpdateUniversitySchema>;

// ---- Widget Konfigürasyonu ----

export const WidgetConfigSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Geçerli bir hex renk kodu giriniz')
    .optional(),
  theme: z.enum(['light', 'dark']).optional(),
});

export type WidgetConfigDto = z.infer<typeof WidgetConfigSchema>;
