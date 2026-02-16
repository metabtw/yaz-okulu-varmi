/**
 * DashboardNav - Dashboard sidebar navigasyon menusu.
 * Rol bazli menu: Admin tum menuleri, University kendi menularini gorur.
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import {
  LayoutDashboard, BookOpen, Building2, Clock, Settings, LogOut, MapPin
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Genel Bakış', icon: LayoutDashboard },
  { href: '/dashboard/courses', label: 'Ders Yönetimi', icon: BookOpen },
  { href: '/dashboard/universities', label: 'Üniversite Yönetimi', icon: Building2, adminOnly: true },
  { href: '/dashboard/pending', label: 'Onay Bekleyenler', icon: Clock, adminOnly: true },
  { href: '/dashboard/settings', label: 'Profil & Widget', icon: Settings },
];

const studentNavItems: NavItem[] = [
  { href: '/dashboard/student', label: 'Öğrenci Paneli', icon: LayoutDashboard },
  { href: '/dashboard/student/search-history', label: 'Arama Geçmişim', icon: BookOpen },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        setRole(payload.role || '');
      } catch {
        // ignore
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
  };

  const items = role === 'STUDENT' ? studentNavItems : navItems;
  const filteredItems = items.filter((item) => {
    if ('adminOnly' in item && item.adminOnly && role !== 'ADMIN') return false;
    return true;
  });

  return (
    <nav className="space-y-1">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 px-3 py-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-900">YOV? Panel</span>
      </Link>

      {filteredItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-blue-500 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
            )}
          >
            <Icon className="w-4 h-4" />
            {item.label}
          </Link>
        );
      })}

      <div className="h-px bg-slate-200 my-4" />

      <Link
        href="/"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
      >
        <MapPin className="w-4 h-4" />
        Siteye Dön
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all w-full text-left"
      >
        <LogOut className="w-4 h-4" />
        Çıkış Yap
      </button>
    </nav>
  );
}
