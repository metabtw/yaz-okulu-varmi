/**
 * Onay Bekleniyor Sayfası - PENDING durumundaki üniversite yetkilileri için.
 * Hesap admin tarafından onaylanana kadar bu sayfa gösterilir.
 */
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PendingPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-white px-4">
      <div className="w-full max-w-lg text-center">
        <div className="bg-card rounded-xl border border-border p-10 shadow-sm">
          {/* Saat ikonu */}
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3">
            Hesabınız Onay Bekliyor
          </h1>
          <p className="text-muted-foreground mb-6">
            Üniversite yetkilisi olarak kaydınız alındı. Hesabınız sistem yöneticisi
            tarafından inceleniyor. Onaylandığında panele erişebileceksiniz.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-800">
              Bu işlem genellikle 1-2 iş günü içinde tamamlanır. Acil durumlarda
              lütfen <strong>destek@yazokuluvarmi.com</strong> adresine ulaşın.
            </p>
          </div>

          <div className="flex gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center h-9 px-4 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center h-9 px-4 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
