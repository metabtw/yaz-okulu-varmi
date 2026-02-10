/**
 * Dashboard Ana Sayfa - Gerçek platform istatistikleri.
 * Admin: Tüm platform istatistikleri + hızlı işlemler.
 * University: Kendi ders istatistikleri.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

interface DashboardStats {
  totalCourses: number;
  totalUniversities: number;
  verifiedUniversities: number;
  totalUsers: number;
  pendingUsers: number;
  totalSearches: number;
  onlineCourses: number;
  todaySearches: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    // Token'dan rol bilgisini al
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        setRole(payload.role || '');
      } catch { /* ignore */ }
    }

    // İstatistikleri yükle
    adminApi.getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-muted-foreground">Yukleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Genel Bakis</h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Toplam Ders" value={stats?.totalCourses ?? 0} color="text-primary" />
        <StatCard label="Toplam Universite" value={stats?.totalUniversities ?? 0} color="text-green-600" />
        <StatCard label="Online Ders" value={stats?.onlineCourses ?? 0} color="text-blue-600" />
        <StatCard label="Toplam Arama" value={stats?.totalSearches ?? 0} color="text-purple-600" />
      </div>

      {/* Admin'e özel kartlar */}
      {role === 'ADMIN' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Onay Bekleyen" value={stats?.pendingUsers ?? 0} color="text-amber-600" />
          <StatCard label="Onayli Universite" value={stats?.verifiedUniversities ?? 0} color="text-emerald-600" />
          <StatCard label="Toplam Kullanici" value={stats?.totalUsers ?? 0} color="text-indigo-600" />
          <StatCard label="Bugunun Aramalari" value={stats?.todaySearches ?? 0} color="text-rose-600" />
        </div>
      )}

      {/* Hızlı İşlemler */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Hizli Islemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction
            href="/dashboard/courses"
            icon="+"
            iconBg="bg-primary/10 text-primary"
            title="Ders Yonetimi"
            desc="Dersleri goruntule ve yonet"
          />
          {role === 'ADMIN' && (
            <>
              <QuickAction
                href="/dashboard/universities"
                icon="U"
                iconBg="bg-green-50 text-green-600"
                title="Universite Yonetimi"
                desc="Universite ekle ve yonet"
              />
              <QuickAction
                href="/dashboard/pending"
                icon={String(stats?.pendingUsers ?? 0)}
                iconBg="bg-amber-50 text-amber-600"
                title="Onay Bekleyenler"
                desc="Basvurulari incele"
              />
            </>
          )}
          <QuickAction
            href="/dashboard/settings"
            icon="W"
            iconBg="bg-blue-50 text-blue-600"
            title="Widget Ayarlari"
            desc="Sitenize gomun"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function QuickAction({ href, icon, iconBg, title, desc }: {
  href: string; icon: string; iconBg: string; title: string; desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-4 rounded-md border border-border hover:bg-secondary transition-colors"
    >
      <div className={`w-10 h-10 rounded-md ${iconBg} flex items-center justify-center font-bold text-lg`}>
        {icon}
      </div>
      <div>
        <p className="font-medium text-sm">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
