/**
 * Kök Layout - Tüm sayfaları saran ana düzen.
 * Font yükleme, global CSS ve metadata tanımları.
 */
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '@/contexts/favorites-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yaz Okulu Var mı? | Türkiye Yaz Okulu Ders Arama',
  description:
    'Türkiye\'deki tüm üniversitelerin yaz okulu derslerini tek bir platformda arayın, karşılaştırın ve başvurun.',
  keywords: ['yaz okulu', 'üniversite', 'ders arama', 'AKTS', 'uzaktan eğitim'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <FavoritesProvider>{children}</FavoritesProvider>
      </body>
    </html>
  );
}
