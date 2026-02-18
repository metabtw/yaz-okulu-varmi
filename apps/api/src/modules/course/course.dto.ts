/**
 * Course DTO'ları - Zod validasyon şemaları.
 * Ders oluşturma, güncelleme ve arama filtreleri.
 */
import { z } from 'zod';

// ---- Ders Oluşturma ----

export const CreateCourseSchema = z.object({
  code: z
    .string()
    .min(2, 'Ders kodu en az 2 karakter olmalıdır')
    .max(20),
  name: z
    .string()
    .min(2, 'Ders adı en az 2 karakter olmalıdır')
    .max(200),
  ects: z
    .number()
    .int('AKTS tam sayı olmalıdır')
    .min(1, 'AKTS en az 1 olmalıdır')
    .max(30, 'AKTS en fazla 30 olabilir'),
  price: z
    .number()
    .min(0, 'Ücret negatif olamaz')
    .optional(),
  currency: z.string().default('TRY'),
  isOnline: z.boolean().default(false),
  description: z.string().max(5000).optional().or(z.literal('')),
  applicationUrl: z.union([
    z.string().url('Geçerli bir URL giriniz'),
    z.literal(''),
  ]).optional(),
  quota: z
    .number()
    .int()
    .min(1, 'Kontenjan en az 1 olmalıdır')
    .optional()
    .nullable(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  applicationDeadline: z.string().datetime().optional(),
});

export type CreateCourseDto = z.infer<typeof CreateCourseSchema>;

// ---- Ders Güncelleme ----

export const UpdateCourseSchema = z.object({
  code: z.string().min(2).max(20).optional(),
  name: z.string().min(2).max(200).optional(),
  ects: z.number().int().min(1).max(30).optional(),
  price: z.number().min(0).optional().nullable(),
  currency: z.string().optional(),
  isOnline: z.boolean().optional(),
  description: z.string().max(5000).optional().or(z.literal('')),
  applicationUrl: z.union([z.string().url(), z.literal('')]).optional(),
  quota: z.number().int().min(1).optional().nullable(),
  startDate: z.string().datetime().optional().nullable(),
  endDate: z.string().datetime().optional().nullable(),
  applicationDeadline: z.string().datetime().optional().nullable(),
});

export type UpdateCourseDto = z.infer<typeof UpdateCourseSchema>;

// ---- Arama Filtreleri ----

export const SearchCoursesSchema = z.object({
  q: z.string().optional(),                           // Arama metni (ders adı veya kodu)
  city: z.string().optional(),                         // Şehir filtresi
  universityId: z.string().optional(),                 // Üniversite filtresi
  isOnline: z.enum(['true', 'false']).optional(),      // Online filtresi
  minEcts: z.string().optional(),                      // Minimum AKTS
  maxEcts: z.string().optional(),                      // Maximum AKTS
  minPrice: z.string().optional(),                     // Minimum ücret
  maxPrice: z.string().optional(),                     // Maximum ücret
  page: z.string().optional().default('1'),            // Sayfa numarası
  limit: z.string().optional().default('20'),          // Sayfa başına sonuç
  sortBy: z.enum(['name', 'price', 'ects', 'createdAt', 'startDate']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
});

export type SearchCoursesDto = z.infer<typeof SearchCoursesSchema>;
