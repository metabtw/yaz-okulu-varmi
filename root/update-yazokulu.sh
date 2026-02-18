cat > /root/update-yazokulu.sh << 'EOF'
#!/bin/bash

echo "🔄 Yaz Okulu güncelleme başlıyor..."

cd /var/www/yazokulu

echo "📥 Git değişiklikleri çekiliyor..."
git pull origin main

echo "📦 Bağımlılıklar güncelleniyor..."
npm install

echo "🔧 Backend build ediliyor..."
cd apps/api
npm install
npx prisma generate
npm run build

echo "🎨 Frontend build ediliyor..."
cd ../web
npm install
npm run build

echo "🔄 Servisler yeniden başlatılıyor..."
pm2 restart all
pm2 save

echo "✅ Güncelleme tamamlandı!"
pm2 status
EOF

chmod +x /root/update-yazokulu.sh