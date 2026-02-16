/**
 * SearchHeader - Arama sayfası header'ı.
 * Ana header ile aynı auth mantığı: giriş yapılmışsa Hesabım butonu.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { SearchBar } from './search-bar';

interface SearchHeaderProps {
  defaultSearchValue?: string;
}

export function SearchHeader({ defaultSearchValue = '' }: SearchHeaderProps) {
  const [authState, setAuthState] = useState<{ loggedIn: boolean; role?: string }>({
    loggedIn: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const parts = token.split('.');
          const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
          setAuthState({ loggedIn: true, role: payload.role });
        } catch {
          setAuthState({ loggedIn: false });
        }
      } else {
        setAuthState({ loggedIn: false });
      }
    }
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 h-16">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
              <MapPin className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-900 hidden sm:block">
              Yaz Okulu Var mı?
            </span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchBar variant="compact" defaultValue={defaultSearchValue} />
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {authState.loggedIn ? (
              <Link
                href={authState.role === 'STUDENT' ? '/dashboard/student' : '/dashboard'}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-xl transition-all shadow-sm"
              >
                Hesabım
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-all"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="hidden md:inline-flex px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-xl transition-all shadow-sm"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
