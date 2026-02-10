/**
 * DashboardNav - Dashboard sidebar navigasyon menüsü.
 * Rol bazlı menü: Admin tüm menüleri, University kendi menülerini görür.
 */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface NavItem {
  href: string;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Genel Bakis' },
  { href: '/dashboard/courses', label: 'Ders Yonetimi' },
  { href: '/dashboard/universities', label: 'Universite Yonetimi', adminOnly: true },
  { href: '/dashboard/pending', label: 'Onay Bekleyenler', adminOnly: true },
  { href: '/dashboard/settings', label: 'Profil Ayarlari' },
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

  const filteredItems = navItems.filter((item) => {
    if (item.adminOnly && role !== 'ADMIN') return false;
    return true;
  });

  return (
    <nav className="space-y-1">
      {filteredItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
          )}
        >
          {item.label}
        </Link>
      ))}

      <hr className="my-4 border-border" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full text-left"
      >
        Cikis Yap
      </button>
    </nav>
  );
}
