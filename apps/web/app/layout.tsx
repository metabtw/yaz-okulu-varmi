/**
 * Kök Layout - Tüm sayfaları saran ana düzen.
 * Font yükleme, global CSS ve metadata tanımları.
 */
import type { Metadata } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { CompareProvider } from '@/contexts/compare-context';
import { CompareFloatingButton } from '@/components/compare/CompareFloatingButton';
import { AuthLoadingOverlay } from '@/components/layout/AuthLoadingOverlay';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

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
      <body className={`${inter.className} ${lexend.variable}`}>
        <FavoritesProvider>
          <CompareProvider>
            {children}
            <CompareFloatingButton />
          </CompareProvider>
        </FavoritesProvider>
        <Toaster position="top-right" richColors />
        <AuthLoadingOverlay />
      </body>
    </html>
  );
}
