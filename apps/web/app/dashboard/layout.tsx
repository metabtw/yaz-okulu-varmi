/**
 * Dashboard Layout - Yetkili panel duzeni.
 * Sidebar navigasyonu iceren temiz layout.
 */
import { DashboardNav } from '@/components/layout/dashboard-nav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-slate-200 bg-white min-h-screen p-4 sticky top-0 h-screen overflow-y-auto">
          <DashboardNav />
        </aside>

        {/* Ana Icerik */}
        <main className="flex-1 p-6 lg:p-8 min-h-screen">{children}</main>
      </div>
    </div>
  );
}
