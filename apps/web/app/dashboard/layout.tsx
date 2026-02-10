/**
 * Dashboard Layout - Yetkili panel düzeni.
 * Sidebar navigasyonu ve üst bar içerir.
 * Server Component: Kullanıcı bilgisi sunucu tarafında kontrol edilir.
 */
import Link from 'next/link';
import { DashboardNav } from '@/components/layout/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Üst Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border">
        <div className="flex items-center justify-between h-16 px-6">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            YOV? Panel
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Siteye Dön
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-border bg-card min-h-[calc(100vh-4rem)] p-4">
          <DashboardNav />
        </aside>

        {/* Ana İçerik */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
