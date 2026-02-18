/**
 * Kök Layout - Tüm sayfaları saran ana düzen.
 * Font yükleme, global CSS, PWA ve metadata tanımları.
 */
import type { Metadata, Viewport } from 'next';
import { Inter, Lexend } from 'next/font/google';
import './globals.css';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { CompareProvider } from '@/contexts/compare-context';
import { CompareFloatingButton } from '@/components/compare/CompareFloatingButton';
import { AuthLoadingOverlay } from '@/components/layout/AuthLoadingOverlay';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

// PWA Viewport ayarları
export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export const metadata: Metadata = {
  title: 'Yaz Okulu Var mı? | Türkiye Yaz Okulu Ders Arama',
  description:
    'Türkiye\'deki tüm üniversitelerin yaz okulu derslerini tek bir platformda arayın, karşılaştırın ve başvurun.',
  keywords: ['yaz okulu', 'üniversite', 'ders arama', 'AKTS', 'uzaktan eğitim'],
  // PWA Manifest
  manifest: '/manifest.json',
  // Apple Touch Icon
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YazOkulu',
  },
  // Icons
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
    ],
  },
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://yazokuluvarmi.com',
    siteName: 'Yaz Okulu Var mı?',
    title: 'Yaz Okulu Var mı? | Türkiye Yaz Okulu Ders Arama',
    description: 'Türkiye\'deki tüm üniversitelerin yaz okulu derslerini tek bir platformda arayın.',
  },
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Yaz Okulu Var mı?',
    description: 'Türkiye\'deki tüm üniversitelerin yaz okulu derslerini tek bir platformda arayın.',
  },
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
