# Yaz Okulu Var mi? - Turkiye Yaz Okulu Ders Arama Platformu

Turkiye'deki universitelerin yaz okulu ders bilgilerini standardize eden, universite yetkililerine kendi verilerini yonetme imkani taniyan (SaaS) ve ogrencilere akilli filtreleme ile karar destegi sunan merkezi bir platformdur.

> **TUBITAK destekli akademik arastirma projesi**

---

## Proje Ozellikleri

- **Ogrenci Arayuzu:** 3D Turkiye haritasi (Three.js - planli), merkezi ders arama, akilli filtreler (sehir, AKTS, ucret, online/yuzyuze), **ogrenci dashboard** (favoriler, oneriler, arama gecmisi, analitikler), **favoriye ekleme** (search + detay sayfasi)
- **Universite Paneli:** Ders CRUD, profil yonetimi, widget ayarlari (kendi sitelerine gomme)
- **Admin Paneli:** Universite onaylama, ders yonetimi, kullanici onay mekanizmasi, platform istatistikleri
- **Widget API:** Universitelerin kendi sitelerine Headless API ile ders tablosu gomebilmesi
- **Akademik Loglama:** Her arama SearchLog tablosuna kaydedilir (makale icin istatistiksel analiz)
- **Turkce Dogal Dil Arama Parser:** "Izmir'de online matematik", "6 AKTS'lik ucuz ders" gibi sorgulari otomatik filtreye cevirir (81 il, AKTS, fiyat, online/yuzyuze)
- **RBAC Guvenlik:** Admin, University, Student rolleri + JWT authentication
- **Universite Onay Mekanizmasi:** .edu.tr domain kontrolu, PENDING/ACTIVE/REJECTED status yonetimi

---

## Teknoloji Yigini (Tech Stack)

| Katman | Teknoloji |
|--------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Shadcn/UI |
| **Backend** | NestJS 10, TypeScript, Passport.js (JWT) |
| **Veritabani** | PostgreSQL 16 (Docker), Prisma ORM |
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
│   │       │   ├── constants/roles.ts    # Role & UserStatus (Prisma enum re-export)
│   │       │   ├── guards/roles.guard.ts # RBAC Guard
│   │       │   ├── decorators/roles.decorator.ts
│   │       │   ├── pipes/zod-validation.pipe.ts
│   │       │   └── filters/http-exception.filter.ts
│   │       ├── prisma/               # Prisma Service (Singleton)
│   │       └── modules/
│   │           ├── admin/            # Admin: onay, istatistik, uni/ders CRUD
│   │           ├── auth/             # JWT auth, register, login
│   │           ├── course/           # Ders CRUD + akilli arama + SearchParser
│   │           ├── student/          # Ogrenci dashboard API (favoriler, oneriler)
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
│       │   │   ├── student/         # Ogrenci dashboard (favoriler, oneriler, arama gecmisi)
│       │   │   ├── universities/    # Universite yonetimi (Admin)
│       │   │   ├── pending/         # Onay bekleyenler (Admin)
│       │   │   └── settings/        # Profil & widget ayarlari
│       │   └── pending/             # "Hesabiniz onay bekliyor" sayfasi
│       ├── components/layout/        # Paylasilmis UI bilesenleri
│       ├── contexts/                 # FavoritesContext (favori senkronizasyonu)
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
User          University       Course          SearchLog       ActivityLog    UserFavorite    UserInteraction
─────         ──────────       ──────          ─────────       ───────────   ────────────    ──────────────
id            id               id              id              id            id              id
email         name (unique)    code            searchQuery     userId        userId          userId
passwordHash  slug (unique)    name            filters         action        courseId        courseId
fullName      city             ects            resultCount     entity        createdAt       actionType
role          logo             price           ipHash          entityId                     createdAt
status        website          currency        userAgent       details
universityId  contactEmail     isOnline        createdAt       ipAddress
department    isVerified       viewCount       userId          createdAt
preferredCities widgetConfig   applicationUrl
createdAt     createdAt       quota
updatedAt     updatedAt        startDate
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
| GET | `/api/courses` | Ders arama (filtreler: q, city, isOnline, minEcts, maxEcts, minPrice, maxPrice). `q` parametresi Turkce dogal dil parser ile parse edilir |
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

### Student (JWT + STUDENT rolu)
| Metod | Endpoint | Aciklama |
|-------|----------|----------|
| GET | `/api/student/profile` | Profil bilgisi |
| GET | `/api/student/stats` | Istatistikler (arama, favori, etkilesim sayilari) |
| GET | `/api/student/favorites` | Favori dersler |
| POST | `/api/student/favorites` | Favoriye ekle (body: `{ courseId }`) |
| DELETE | `/api/student/favorites/:courseId` | Favoriden cikar |
| GET | `/api/student/search-history` | Arama gecmisi |
| GET | `/api/student/interactions` | Incelenen dersler |
| GET | `/api/student/recommendations` | Onerilen dersler |
| POST | `/api/student/interactions` | Etkilesim kaydi (VIEW/FAVORITE/APPLY) |

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
- Docker Desktop (PostgreSQL + Redis icin)
- Git

### 1. Repoyu klonla

```bash
git clone https://github.com/metabtw/yaz-okulu-varmi.git
cd yaz-okulu-varmi
```

### 2. Bagimliliklari yukle

```bash
npm install
```

### 3. Docker servislerini baslat

```bash
docker compose up -d
```

Bu komut PostgreSQL (port 5432) ve Redis (port 6379) konteynerlerini baslatir.

### 4. Ortam degiskenlerini ayarla

```bash
# Backend
cp apps/api/.env.example apps/api/.env

# Frontend
cp apps/web/.env.example apps/web/.env.local
```

Varsayilan `.env` degerleri:

```
DATABASE_URL="postgresql://yazokulu:yazokulu123@localhost:5432/yazokulu_db?schema=public"
JWT_SECRET="super-secret-jwt-key-degistir-beni"
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

### 5. Veritabanini hazirla

```bash
cd apps/api

# Prisma client olustur
npx prisma generate

# Migration calistir (tablolari PostgreSQL'e yaz)
npx prisma migrate dev --name init

# Ornek verileri yukle (admin, universiteler, dersler)
npx ts-node prisma/seed.ts
```

### 6. Uygulamayi baslat

```bash
# Backend (port 4000)
cd apps/api
npx nest start --watch

# Frontend (port 3000) - Ayri terminal
cd apps/web
npx next dev
```

### 7. Veritabanini gorsel olarak incele

```bash
# Prisma Studio (http://localhost:5555)
cd apps/api
npx prisma studio

# Veya pgAdmin ile: localhost:5432, user: yazokulu, pass: yazokulu123, db: yazokulu_db
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

### Veritabani (PostgreSQL)

Proje PostgreSQL 16 kullanmaktadir. Veritabani Docker Compose ile ayaga kalkar.

**Sema ozellikleri:**
- `Role` ve `UserStatus` PostgreSQL native **enum** olarak tanimli
- `price` alani `Decimal(10,2)` ile hassas para hesabi
- `widgetConfig`, `filters`, `details` alanlari PostgreSQL native **Json** tipi
- Arama sorgularinda `mode: 'insensitive'` (buyuk/kucuk harf duyarsiz)
- Performans icin index'ler: sehir, rol, status, ders adi, ders kodu, bilesik index

**Yeni migration olusturmak icin:**

```bash
cd apps/api
npx prisma migrate dev --name degisiklik_adi
```

### Tamamlanan Ozellikler (v2)

- [x] Modern futuristic landing page (glassmorphism hero, dark theme, animasyonlu istatistikler)
- [x] Ders detay sayfasi (split layout, sticky sidebar, basvuru linki)
- [x] Universiteler icin B2B landing page
- [x] FAQ sayfasi (accordion, arama, kategoriler)
- [x] Dashboard: gercek veri ceken istatistikler (Admin + University)
- [x] Ders CRUD - ekleme, duzenleme (kalem ikonu), silme (cop kutusu)
- [x] Profil ayarlari - universite bilgileri kaydetme
- [x] Widget rehberi + gomme kodu + Headless API dokumantasyonu
- [x] Modal bildirim sistemi (onay, hata, basari mesajlari)
- [x] Turkce karakter destegi tum arayuzde
- [x] **Ogrenci Dashboard:** Favoriler, oneriler, arama gecmisi, incelenen dersler, tercih analitikleri
- [x] **Turkce Dogal Dil Arama Parser:** "Izmir'de online ders", "6 AKTS matematik" gibi sorgulari filtreye cevirir (81 il, AKTS, fiyat)
- [x] **Favoriye Ekleme:** Search + detay sayfasinda favori butonu, FavoritesContext ile tum sayfalarda senkron
- [x] **Hakkinda sayfasi** (/about)
- [x] **Header:** Giris yapilmissa "Hesabim" butonu (rol bazli yonlendirme)
- [x] **Search sayfasi header:** Ana header ile ayni auth mantigi

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
