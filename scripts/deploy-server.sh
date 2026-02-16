#!/bin/bash
# Yaz Okulu Var mı? - Sunucu Deploy Script
# Bu script "npm: call config.load() before reading values" hatası alındığında alternatif çözümler sunar.

set -e
PROJECT_DIR="${PROJECT_DIR:-/var/www/yazokulu}"

echo "=== Yaz Okulu Deploy Script ==="
echo "Proje dizini: $PROJECT_DIR"
cd "$PROJECT_DIR"

# 1. npm config hatası varsa düzelt
fix_npm_config() {
    echo ">>> npm config düzeltmesi deneniyor..."
    # nvm prefix çakışmasını kaldır
    nvm use --delete-prefix 20 2>/dev/null || true
    # Bozuk prefix env var
    unset npm_config_prefix 2>/dev/null || true
    # Minimal .npmrc - prefix olmadan
    if [ ! -f ~/.npmrc ] || grep -q "prefix" ~/.npmrc 2>/dev/null; then
        echo "# npm config - nvm uyumlu" > ~/.npmrc
    fi
}

# 2. NodeSource ile temiz Node kurulumu (nvm sorunluysa)
install_nodesource() {
    echo ">>> NodeSource ile Node.js 20 kuruluyor..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node: $(node -v), npm: $(npm -v)"
}

# 3. Ana kurulum
do_install() {
    echo ">>> Bağımlılıklar yükleniyor (monorepo root)..."
    npm install

    echo ">>> API kurulumu..."
    cd apps/api
    npx prisma generate
    npx prisma migrate deploy
    npm run db:seed || npm run seed || echo "Seed atlandı (zaten veri olabilir)"
    npm run build
    cd ../..

    echo ">>> Web kurulumu..."
    cd apps/web
    npm install
    npm run build
    cd ../..

    echo ">>> Kurulum tamamlandı!"
}

# Çalıştır
echo ""
echo "Adım 1: npm config düzeltmesi"
fix_npm_config

echo ""
echo "Adım 2: npm test"
if npm -v >/dev/null 2>&1; then
    echo "npm çalışıyor: $(npm -v)"
    do_install
else
    echo "npm hala çalışmıyor. NodeSource ile yeniden kurulum deneniyor..."
    install_nodesource
    do_install
fi
