/**
 * Dashboard Ana Sayfa - Gercek platform istatistikleri.
 * Admin: Tum platform istatistikleri.
 * University: Kendi universite istatistikleri.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi, userApi, courseApi } from '@/lib/api';
import { BookOpen, Building2, Search, Users, Clock, TrendingUp, Settings, Plus } from 'lucide-react';

interface AdminStats {
  totalCourses: number;
  totalUniversities: number;
  verifiedUniversities: number;
  totalUsers: number;
  pendingUsers: number;
  totalSearches: number;
  onlineCourses: number;
  todaySearches: number;
}

interface UniStats {
  totalCourses: number;
  onlineCourses: number;
  universityName: string;
  city: string;
}

export default function DashboardPage() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [uniStats, setUniStats] = useState<UniStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let userRole = '';
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      userRole = payload.role || '';
      setRole(userRole);
    } catch { /* ignore */ }

    const loadData = async () => {
      try {
        if (userRole === 'ADMIN') {
          const stats = await adminApi.getDashboardStats();
          setAdminStats(stats);
        } else if (userRole === 'UNIVERSITY') {
          // University rolu icin kendi verilerini cek
          const [meData, coursesData] = await Promise.all([
            userApi.getMe(),
            courseApi.getMyUniversityCourses() as Promise<Array<{ isOnline: boolean }>>,
          ]);

          const courses = coursesData || [];
          setUniStats({
            totalCourses: courses.length,
            onlineCourses: courses.filter((c) => c.isOnline).length,
            universityName: meData.university?.name || 'Bilinmiyor',
            city: meData.university?.city || '',
          });
        }
      } catch (err) {
        console.error('Dashboard verileri yuklenemedi:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Genel Bakış</h1>

      {/* ======== ADMIN DASHBOARD ======== */}
      {role === 'ADMIN' && adminStats && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard icon={BookOpen} label="Toplam Ders" value={adminStats.totalCourses} color="blue" />
            <StatCard icon={Building2} label="Toplam Üniversite" value={adminStats.totalUniversities} color="emerald" />
            <StatCard icon={Search} label="Toplam Arama" value={adminStats.totalSearches} color="violet" />
            <StatCard icon={Users} label="Toplam Kullanıcı" value={adminStats.totalUsers} color="amber" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Clock} label="Onay Bekleyen" value={adminStats.pendingUsers} color="rose" />
            <StatCard icon={Building2} label="Onaylı Üniversite" value={adminStats.verifiedUniversities} color="teal" />
            <StatCard icon={TrendingUp} label="Online Ders" value={adminStats.onlineCourses} color="indigo" />
            <StatCard icon={Search} label="Bugünün Aramaları" value={adminStats.todaySearches} color="sky" />
          </div>
        </>
      )}

      {/* ======== UNIVERSITY DASHBOARD ======== */}
      {role === 'UNIVERSITY' && uniStats && (
        <>
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <p className="text-sm text-blue-100 mb-1">Hoşgeldiniz</p>
            <h2 className="text-xl font-bold">{uniStats.universityName}</h2>
            {uniStats.city && <p className="text-sm text-blue-200 mt-1">{uniStats.city}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard icon={BookOpen} label="Toplam Ders" value={uniStats.totalCourses} color="blue" />
            <StatCard icon={TrendingUp} label="Online Ders" value={uniStats.onlineCourses} color="violet" />
            <StatCard icon={BookOpen} label="Yüzyüze Ders" value={uniStats.totalCourses - uniStats.onlineCourses} color="amber" />
          </div>
        </>
      )}

      {/* Hizli Islemler */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <QuickAction
            href="/dashboard/courses"
            icon={Plus}
            color="blue"
            title="Ders Yönetimi"
            desc="Dersleri görüntüle, ekle ve düzenle"
          />
          {role === 'UNIVERSITY' && (
            <QuickAction
              href="/dashboard/university"
              icon={TrendingUp}
              color="violet"
              title="Analitik Dashboard"
              desc="Görüntülenme, favori ve başvuru istatistikleri"
            />
          )}
          {role === 'ADMIN' && (
            <>
              <QuickAction
                href="/dashboard/universities"
                icon={Building2}
                color="emerald"
                title="Üniversite Yönetimi"
                desc="Üniversite ekle ve yönet"
              />
              <QuickAction
                href="/dashboard/pending"
                icon={Clock}
                color="amber"
                title={`Onay Bekleyenler${adminStats?.pendingUsers ? ` (${adminStats.pendingUsers})` : ''}`}
                desc="Başvuruları incele"
              />
            </>
          )}
          <QuickAction
            href="/dashboard/settings"
            icon={Settings}
            color="slate"
            title="Profil & Widget Ayarları"
            desc="Profil bilgileri ve widget kodu"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    violet: 'bg-violet-50 text-violet-500',
    amber: 'bg-amber-50 text-amber-500',
    rose: 'bg-rose-50 text-rose-500',
    teal: 'bg-teal-50 text-teal-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    sky: 'bg-sky-50 text-sky-500',
    slate: 'bg-slate-50 text-slate-500',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className={`w-10 h-10 rounded-xl ${colorMap[color] || colorMap.blue} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({ href, icon: Icon, color, title, desc }: {
  href: string; icon: React.ComponentType<{ className?: string }>; color: string; title: string; desc: string;
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-500',
    emerald: 'bg-emerald-50 text-emerald-500',
    amber: 'bg-amber-50 text-amber-500',
    slate: 'bg-slate-50 text-slate-500',
  };

  return (
    <Link
      href={href}
      className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 hover:shadow-sm transition-all"
    >
      <div className={`w-11 h-11 rounded-xl ${colorMap[color] || colorMap.blue} flex items-center justify-center shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium text-sm text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
    </Link>
  );
}
