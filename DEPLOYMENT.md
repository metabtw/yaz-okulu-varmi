# Yaz Okulu Var mı? - Sunucuya Kurulum Rehberi

Bu rehber Ubuntu 22.04 sunucusuna projeyi deploy etmek için adım adım talimatlar içerir.

## Ön Koşullar

- Ubuntu 22.04 LTS
- Node.js 18+ (nvm ile kurulum önerilir)
- PostgreSQL 16
- Git

---

## 1. Sunucu Hazırlığı

```bash
# Güncellemeler
sudo apt update && sudo apt upgrade -y

# Gerekli paketler
sudo apt install -y git curl build-essential
```

---

## 2. Node.js Kurulumu (nvm ile)

```bash
# nvm kur
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # veya yeni terminal aç

# Node 20 kur
nvm install 20
nvm use 20
nvm alias default 20

# Kontrol
node -v   # v20.x.x
npm -v    # 10.x.x
```

---

## 3. PostgreSQL Kurulumu

```bash
sudo apt install -y postgresql postgresql-contrib

# Veritabanı ve kullanıcı oluştur
sudo -u postgres psql -c "CREATE USER yazokulu WITH PASSWORD 'GÜÇLÜ_ŞİFRE_BURAYA';"
sudo -u postgres psql -c "CREATE DATABASE yazokulu_db OWNER yazokulu;"
```

---

## 4. Proje Kurulumu

```bash
# Proje dizini
sudo mkdir -p /var/www/yazokulu
sudo chown $USER:$USER /var/www/yazokulu
cd /var/www/yazokulu

# Repo klonla
git clone https://github.com/metabtw/yaz-okulu-varmi.git .

# Monorepo root'tan bağımlılıkları yükle
npm install
```

---

## 5. Backend (API) Kurulumu

```bash
cd /var/www/yazokulu/apps/api

# .env dosyası oluştur
cp .env.example .env
nano .env
```

**.env örneği:**
```env
DATABASE_URL="postgresql://yazokulu:GÜÇLÜ_ŞİFRE@localhost:5432/yazokulu_db?schema=public"
JWT_SECRET="çok-güçlü-ve-rastgele-bir-secret-key-buraya"
PORT=4000
API_URL="http://SUNUCU_IP:4000"
FRONTEND_URL="http://SUNUCU_IP:3000"
```

```bash
# Prisma client oluştur
npx prisma generate

# Migration'ları uygula (veritabanı şeması)
npx prisma migrate deploy

# Örnek verileri yükle (admin, üniversiteler, dersler)
npm run db:seed
# veya: npx ts-node prisma/seed.ts

# Build
npm run build

# Test çalıştır
npm run start
```

---

## 6. Frontend (Web) Kurulumu

```bash
cd /var/www/yazokulu/apps/web

# .env.local oluştur
cp .env.example .env.local
nano .env.local
```

**.env.local örneği:**
```env
NEXT_PUBLIC_API_URL="http://SUNUCU_IP:4000/api"
API_URL="http://localhost:4000"
```

```bash
# Build
npm run build

# Test çalıştır
npm run start
```

---

## 7. PM2 ile Sürekli Çalıştırma

```bash
# PM2 kur
npm install -g pm2

# API'yi başlat
cd /var/www/yazokulu
pm2 start apps/api/dist/main.js --name "yazokulu-api"

# Web'i başlat
pm2 start npm --name "yazokulu-web" -- run start --prefix apps/web

# Otomatik başlatma
pm2 startup
pm2 save
```

---

## 8. Nginx Reverse Proxy (Opsiyonel)

```nginx
# /etc/nginx/sites-available/yazokulu
server {
    listen 80;
    server_name your-domain.com;

    location /api {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Sık Karşılaşılan Sorunlar

### "No migration found"
- `.gitignore`'dan `prisma/migrations/` kaldırıldı mı kontrol edin
- Migration'ları commit edip push edin: `git add apps/api/prisma/migrations && git commit -m "Add migrations"`

### "npm: call config.load() before reading values" / "Exit prior to config file resolving"

Bu hata genelde **nvm + npm 10** kombinasyonunda veya `~/.npmrc` silindikten sonra oluşur.

**Çözüm 1 – nvm prefix temizliği (önce deneyin):**
```bash
# nvm yükle
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 20

# prefix çakışmasını kaldır
nvm use --delete-prefix 20

# Ortam değişkenlerini temizle
unset npm_config_prefix

# Minimal .npmrc oluştur (boş veya sadece yorum)
echo "# npm" > ~/.npmrc

# Monorepo root'tan dene (apps/api yerine!)
cd /var/www/yazokulu
npm install
```

**Çözüm 2 – NodeSource ile Node kurulumu (nvm sorunluysa):**
```bash
# nvm'i devre dışı bırak
unset NVM_DIR
# veya yeni bir SSH oturumunda nvm source etmeyin

# NodeSource ile Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Kontrol
node -v   # v20.x
npm -v    # 10.x

# Kuruluma devam
cd /var/www/yazokulu
npm install
cd apps/api && npx prisma generate && npm run build
```

**Çözüm 3 – Deploy script kullanımı:**
```bash
cd /var/www/yazokulu
chmod +x scripts/deploy-server.sh
./scripts/deploy-server.sh
```

### "Missing script: seed"
- Doğru komut: `npm run db:seed` (apps/api dizininde)
- Veya root'tan: `npm run db:seed` (workspace ile)

### Prisma Decimal hatası (seed)
- seed.ts artık `Decimal` import etmeden number kullanıyor
- Güncel kodu pull edin

### API 404 - "/api/api/courses" (çift /api)
- next.config.js rewrite düzeltildi
- `.env.local` için: `NEXT_PUBLIC_API_URL` = `http://SUNUCU_IP:4000/api` (client)
- `API_URL` = `http://localhost:4000` (server-side, /api olmadan)

---

## Örnek Giriş Bilgileri (Seed sonrası)

| Rol | E-posta | Şifre |
|-----|---------|-------|
| Admin | admin@yazokuluvarmi.com | admin123 |
| Üniversite | yetkili@itu.edu.tr | uni12345 |
