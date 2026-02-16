/**
 * Prisma Seed - Geliştirme ortamı için örnek veriler.
 * Admin kullanıcısı, örnek üniversiteler ve dersler oluşturur.
 * Çalıştırmak için: npx ts-node prisma/seed.ts
 */
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed işlemi başlıyor...');

  // 1. Admin kullanıcısı oluştur
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yazokuluvarmi.com' },
    update: {},
    create: {
      email: 'admin@yazokuluvarmi.com',
      passwordHash: adminPassword,
      fullName: 'Sistem Yöneticisi',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });
  console.log(`Admin oluşturuldu: ${admin.email}`);

  // 2. Örnek üniversiteler oluştur
  const uni1 = await prisma.university.upsert({
    where: { slug: 'istanbul-teknik-universitesi' },
    update: {},
    create: {
      name: 'İstanbul Teknik Üniversitesi',
      slug: 'istanbul-teknik-universitesi',
      city: 'İstanbul',
      website: 'https://www.itu.edu.tr',
      isVerified: true,
    },
  });

  const uni2 = await prisma.university.upsert({
    where: { slug: 'orta-dogu-teknik-universitesi' },
    update: {},
    create: {
      name: 'Orta Doğu Teknik Üniversitesi',
      slug: 'orta-dogu-teknik-universitesi',
      city: 'Ankara',
      website: 'https://www.metu.edu.tr',
      isVerified: true,
    },
  });

  const uni3 = await prisma.university.upsert({
    where: { slug: 'ege-universitesi' },
    update: {},
    create: {
      name: 'Ege Üniversitesi',
      slug: 'ege-universitesi',
      city: 'İzmir',
      website: 'https://www.ege.edu.tr',
      isVerified: true,
    },
  });

  console.log('Üniversiteler oluşturuldu');

  // 3. Üniversite yetkilileri oluştur
  const uniPassword = await bcrypt.hash('uni12345', 12);
  await prisma.user.upsert({
    where: { email: 'yetkili@itu.edu.tr' },
    update: {},
    create: {
      email: 'yetkili@itu.edu.tr',
      passwordHash: uniPassword,
      fullName: 'İTÜ Yaz Okulu Yetkilisi',
      role: Role.UNIVERSITY,
      status: UserStatus.ACTIVE, // Seed'de direkt aktif
      universityId: uni1.id,
    },
  });
  console.log('Üniversite yetkilileri oluşturuldu');

  // 4. Örnek dersler oluştur (Prisma Decimal number kabul eder)
  const courses = [
    { code: 'MAT101', name: 'Matematik I', ects: 6, price: 3500, isOnline: false, universityId: uni1.id },
    { code: 'FIZ101', name: 'Fizik I', ects: 4, price: 2800, isOnline: false, universityId: uni1.id },
    { code: 'BIL101', name: 'Bilgisayar Programlama', ects: 5, price: 4000, isOnline: true, universityId: uni1.id },
    { code: 'MAT201', name: 'Diferansiyel Denklemler', ects: 4, price: 3000, isOnline: false, universityId: uni2.id },
    { code: 'ENG101', name: 'İngilizce I', ects: 3, price: 2000, isOnline: true, universityId: uni2.id },
    { code: 'KIM101', name: 'Genel Kimya', ects: 5, price: 2500, isOnline: false, universityId: uni3.id },
    { code: 'BIO101', name: 'Genel Biyoloji', ects: 4, price: 2200, isOnline: true, universityId: uni3.id },
  ];

  for (const course of courses) {
    await prisma.course.create({
      data: {
        ...course,
        currency: 'TRY',
        description: `${course.name} dersi - Yaz okulu programı kapsamında sunulmaktadır.`,
      },
    });
  }
  console.log(`${courses.length} ders oluşturuldu`);

  console.log('Seed işlemi tamamlandı!');
}

main()
  .catch((e) => {
    console.error('Seed hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
