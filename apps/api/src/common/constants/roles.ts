/**
 * Kullanıcı Rolleri ve Durumları - Uygulama genelinde kullanılan sabitler.
 * SQLite enum desteklemediği için string sabitler kullanılır.
 * Üretim ortamında PostgreSQL'e geçildiğinde Prisma enum'a dönüştürülür.
 */
export const Role = {
  STUDENT: 'STUDENT',
  UNIVERSITY: 'UNIVERSITY',
  ADMIN: 'ADMIN',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/**
 * Kullanıcı hesap durumları.
 * PENDING: Üniversite yetkilisi kayıt oldu, Admin onayı bekliyor.
 * APPROVED: Admin onayladı (geçici durum, hemen ACTIVE'e çevrilir).
 * REJECTED: Admin reddetti.
 * ACTIVE: Hesap aktif, sisteme erişebilir.
 */
export const UserStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];
