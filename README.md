# Yaz Okulu Var mi? - Turkiye Yaz Okulu Ders Arama Platformu

Turkiye'deki universitelerin yaz okulu ders bilgilerini standardize eden, universite yetkililerine kendi verilerini yonetme imkani taniyan (SaaS) ve ogrencilere akilli filtreleme ile karar destegi sunan merkezi bir platformdur.

> **TUBITAK destekli akademik arastirma projesi**

---

## Proje Ozellikleri

- **Ogrenci Arayuzu:** 3D Turkiye haritasi (Three.js - planli), merkezi ders arama, akilli filtreler (sehir, AKTS, ucret, online/yuzyuze)
- **Universite Paneli:** Ders CRUD, profil yonetimi, widget ayarlari (kendi sitelerine gomme)
- **Admin Paneli:** Universite onaylama, ders yonetimi, kullanici onay mekanizmasi, platform istatistikleri
- **Widget API:** Universitelerin kendi sitelerine Headless API ile ders tablosu gomebilmesi
- **Akademik Loglama:** Her arama SearchLog tablosuna kaydedilir (makale icin istatistiksel analiz)
- **RBAC Guvenlik:** Admin, University, Student rolleri + JWT authentication
- **Universite Onay Mekanizmasi:** .edu.tr domain kontrolu, PENDING/ACTIVE/REJECTED status yonetimi

---

## Teknoloji Yigini (Tech Stack)

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/UI |
| **Backend** | NestJS 10, TypeScript, Passport.js (JWT) |
| **Veritabani** | PostgreSQL (prod) / SQLite (dev), Prisma ORM |
| **Validasyon** | Zod (API request/response validation) |
| **Cache** | Redis (planli) |
| **Deployment** | Vercel (Frontend), Railway/Render (Backend) |
| **Konteyner** | Docker Compose (PostgreSQL + Redis) |

---

## Proje Yapisi (Monorepo)

```
yaz-okulu-varmi/
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma         # Veritabani semasi
│   │   │   └── seed.ts              # Ornek veri yukleme
│   │   └── src/
│   │       ├── main.ts              # Uygulama giris noktasi
│   │       ├── app.module.ts        # Ana modul
│   │       ├── common/
│   │       │   ├── constants/roles.ts    # Role & UserStatus sabitleri
│   │       │   ├── guards/roles.guard.ts # RBAC Guard
│   │       │   ├── decorators/roles.decorator.ts
│   │       │   ├── pipes/zod-validation.pipe.ts
│   │       │   └── filters/http-exception.filter.ts
│   │       ├── prisma/               # Prisma Service (Singleton)
│   │       └── modules/
│   │           ├── admin/            # Admin: onay, istatistik, uni/ders CRUD
│   │           ├── auth/             # JWT auth, register, login
│   │           ├── course/           # Ders CRUD + akilli arama
│   │           ├── university/       # Universite CRUD + widget config
│   │           ├── user/             # Kullanici profil yonetimi
│   │           ├── search-log/       # Akademik arama loglari
│   │           └── widget/           # Dis site entegrasyon API
│   │
│   └── web/                          # Next.js 14 Frontend
│       ├── app/
│       │   ├── page.tsx             # Ana sayfa (Hero + arama)
│       │   ├── (auth)/
│       │   │   ├── login/           # Giris sayfasi
│       │   │   └── register/        # Kayit sayfasi (rol secimi)
│       │   ├── (public)/
│       │   │   └── search/          # Arama sonuclari + filtreler
│       │   ├── dashboard/
│       │   │   ├── page.tsx         # Genel bakis (istatistikler)
│       │   │   ├── courses/         # Ders yonetimi
│       │   │   ├── universities/    # Universite yonetimi (Admin)
│       │   │   ├── pending/         # Onay bekleyenler (Admin)
│       │   │   └── settings/        # Profil & widget ayarlari
│       │   └── pending/             # "Hesabiniz onay bekliyor" sayfasi
│       ├── components/layout/        # Paylasilmis UI bilesenleri
│       ├── lib/
│       │   ├── api.ts               # Backend API client
│       │   └── utils.ts             # Yardimci fonksiyonlar (cn)
│       └── middleware.ts            # Rota bazli erisim kontrolu
│
├── packages/
│   └── types/                        # Ortak TypeScript tipleri
│       └── src/index.ts
│
├── docker-compose.yml               # PostgreSQL + Redis
├── package.json                     # Monorepo root (workspaces)
└── tsconfig.base.json               # Paylasilan TS config
```

---

## Veritabani Modeli

```
User          University       Course          SearchLog       ActivityLog
─────         ──────────       ──────          ─────────       ───────────
id            id               id              id              id
email         name (unique)    code            searchQuery     userId
passwordHash  slug (unique)    name            filters         action
fullName      city             ects            resultCount     entity
role          logo             price           ipHash          entityId
status        website          currency        userAgent       details
universityId  contactEmail     isOnline        createdAt       ipAddress
createdAt     isVerified       description                     createdAt
updatedAt     widgetConfig     applicationUrl
              createdAt        quota
              updatedAt        startDate
                               endDate
                               universityId
                               createdAt
                               updatedAt
```

**Roller:** `STUDENT` | `UNIVERSITY` | `ADMIN`
**Kullanici Durumlari:** `PENDING` | `APPROVED` | `REJECTED` | `ACTIVE`

---

## API Endpoint'leri

### Public (Herkes)
| Metod | Endpoint | Aciklama |
|-------|----------|----------|
| GET | `/` | Health check |
| GET | `/api/courses` | Ders arama (filtreler: q, city, isOnline, minEcts, maxEcts, minPrice, maxPrice) |
| GET | `/api/courses/:id` | Ders detayi |
| GET | `/api/universities` | Onayli universite listesi |
| GET | `/api/universities/:id` | Universite detayi |
| GET | `/api/widget/:univId` | Widget verisi (dis site entegrasyonu) |
| POST | `/api/auth/register` | Kullanici kaydi |
| POST | `/api/auth/login` | Kullanici girisi |

### University (JWT + UNIVERSITY rolu)
| Metod | Endpoint | Aciklama |
|-------|----------|----------|
| GET | `/api/university/courses` | Kendi derslerini listele |
| POST | `/api/university/courses` | Yeni ders ekle |
| PATCH | `/api/university/courses/:id` | Ders guncelle |
| DELETE | `/api/university/courses/:id` | Ders sil |

### Admin (JWT + ADMIN rolu)
| Metod | Endpoint | Aciklama |
|-------|----------|----------|
| GET | `/api/admin/dashboard` | Platform istatistikleri |
| GET | `/api/admin/pending-requests` | Onay bekleyen kullanicilar |
| PATCH | `/api/admin/users/:id/approve` | Kullaniciyi onayla |
| PATCH | `/api/admin/users/:id/reject` | Kullaniciyi reddet |
| GET | `/api/admin/universities` | Tum universiteler |
| POST | `/api/admin/universities` | Universite ekle |
| PATCH | `/api/admin/universities/:id` | Universite guncelle |
| DELETE | `/api/admin/universities/:id` | Universite sil |
| GET | `/api/admin/courses` | Tum dersler |
| POST | `/api/admin/courses` | Ders ekle (herhangi bir universiteye) |
| DELETE | `/api/admin/courses/:id` | Ders sil |

---

## Guvenlik Mimarisi

```
Istek Akisi:
                                                    
  Client ──► Next.js Middleware ──► Dashboard Sayfalari
              │                          │
              │ Token kontrol             │ API cagrisi
              │ Rol kontrol               ▼
              │ Status kontrol     NestJS Backend
              ▼                          │
         /login (token yok)       AuthGuard (JWT)
         /pending (PENDING)            │
         / (STUDENT)              RolesGuard (@Roles)
                                       │
                                  Service Katmani
                                       │
                                  Multitenancy Kontrol
                                  (universityId eslesme)
```

- **JWT Authentication:** Bearer token, 7 gun gecerlilik
- **RBAC (Role-Based Access Control):** `@Roles(Role.ADMIN)` decorator + `RolesGuard`
- **Multitenancy:** Universite yetkilileri sadece kendi `universityId`'sine ait verileri gorebilir/duzenleyebilir
- **Universite Onay Mekanizmasi:** `.edu.tr` domain zorunlulugu, admin onay sureci
- **Zod Validation:** Tum API request'leri Zod semalari ile dogrulanir
- **IP Anonimizasyonu:** Arama loglarinda IP SHA-256 ile hashlenir (KVKK uyumlu)

---

## Kurulum

### On Kosullar

- Node.js >= 18
- Docker Desktop (PostgreSQL icin) veya SQLite (gelistirme)
- Git

### 1. Repoyu klonla

```bash
git clone https://github.com/KULLANICI_ADI/yaz-okulu-varmi.git
cd yaz-okulu-varmi
```

### 2. Bagimliliklari yukle

```bash
npm install
```

### 3. Ortam degiskenlerini ayarla

```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env.local
```

### 4. Veritabanini hazirla

**Docker ile PostgreSQL (Onerilen):**
```bash
docker compose up -d postgres
# .env'de DATABASE_URL'i PostgreSQL'e cevir
```

**SQLite ile (Hizli baslangic):**
```bash
# .env zaten SQLite olarak ayarli: DATABASE_URL="file:./dev.db"
```

```bash
cd apps/api
npx prisma generate
npx prisma db push
npx ts-node prisma/seed.ts   # Ornek verileri yukle
```

### 5. Uygulamayi baslat

```bash
# Backend (port 4000)
cd apps/api
npx nest start --watch

# Frontend (port 3000) - Ayri terminal
cd apps/web
npx next dev
```

### 6. Veritabanini gorsel olarak incele

```bash
cd apps/api
npx prisma studio
# Tarayicide http://localhost:5555 acilir
```

---

## Ornek Giris Bilgileri (Seed Data)

| Rol | E-posta | Sifre |
|-----|---------|-------|
| Admin | admin@yazokuluvarmi.com | admin123 |
| Universite Yetkilisi | yetkili@itu.edu.tr | uni12345 |

### Ornek Universiteler (Seed)
- Istanbul Teknik Universitesi (Istanbul) - 3 ders
- Orta Dogu Teknik Universitesi (Ankara) - 2 ders
- Ege Universitesi (Izmir) - 2 ders

---

## Universite Yetkilisi Kayit Akisi

```
1. Kayit Formu ──► Rol: "Universite Yetkilisi" sec
                         │
2. .edu.tr e-posta gir ──► Backend: domain kontrol
                         │
3. Universite adi + sehir gir
                         │
4. Kayit tamamla ──► status: PENDING
                         │
5. /pending sayfasina yonlendir ──► "Hesabiniz onay bekliyor"
                         │
6. Admin ──► /dashboard/pending ──► "Onayla" veya "Reddet"
                         │
7. Onaylaninca ──► status: ACTIVE + University.isVerified: true
                         │
8. Universite yetkilisi artik panele erisebilir
```

---

## Gelistirme Notlari

### PostgreSQL'e Gecis (Uretim)

1. `apps/api/prisma/schema.prisma` dosyasinda `provider = "sqlite"` satirini `provider = "postgresql"` olarak degistir
2. `String` olan `role` ve `status` alanlarini PostgreSQL enum'a cevir
3. `Float` olan `price` alanini `Decimal @db.Decimal(10,2)` yap
4. `String` olan JSON alanlari (`widgetConfig`, `filters`, `details`) `Json` tipine cevir
5. `.env` dosyasindaki `DATABASE_URL`'i PostgreSQL connection string'ine guncelle
6. `npx prisma migrate dev` ile migration olustur

### Planlanan Ozellikler

- [ ] Three.js ile 3D Turkiye haritasi entegrasyonu
- [ ] Redis cache (sik yapilan aramalar icin)
- [ ] Scraper modulu (universite web sitelerinden otomatik veri cekme)
- [ ] E-posta bildirimleri (onay/red bildirimi)
- [ ] Widget JavaScript paketi (universitelerin kendi sitelerine gomme)
- [ ] Fuzzy matching (yakin eslesme ile arama)
- [ ] PWA (Progressive Web App) destegi

---

## Katki

Bu proje TUBITAK akademik arastirma kapsaminda gelistirilmektedir. Katki icin lutfen once bir Issue acin.

## Lisans

Bu proje MIT lisansi altinda lisanslanmistir.
