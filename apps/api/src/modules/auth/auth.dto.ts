/**
 * Auth DTO'ları - Zod ile validasyon şemaları ve TypeScript tipleri.
 * API'den gelen verilerin tip güvenliğini sağlar.
 */
import { z } from 'zod';

// ---- Register DTO ----

export const RegisterSchema = z.object({
  email: z
    .string()
    .email('Geçerli bir e-posta adresi giriniz'),
  password: z
    .string()
    .min(8, 'Şifre en az 8 karakter olmalıdır')
    .max(100, 'Şifre en fazla 100 karakter olabilir'),
  fullName: z
    .string()
    .min(2, 'Ad en az 2 karakter olmalıdır')
    .max(100)
    .optional(),
  role: z
    .enum(['STUDENT', 'UNIVERSITY', 'ADMIN'])
    .optional()
    .default('STUDENT'),
  // Üniversite yetkilisi kayıt alanları
  universityId: z.string().cuid().optional(),
  universityName: z.string().min(3).max(200).optional(),
  city: z.string().min(2).max(100).optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

// ---- Login DTO ----

export const LoginSchema = z.object({
  email: z
    .string()
    .email('Geçerli bir e-posta adresi giriniz'),
  password: z
    .string()
    .min(1, 'Şifre boş olamaz'),
});

export type LoginDto = z.infer<typeof LoginSchema>;
