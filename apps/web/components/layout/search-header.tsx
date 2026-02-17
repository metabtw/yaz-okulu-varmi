/**
 * SearchHeader - Arama sayfası header'ı.
 * Ana header ile aynı auth mantığı: giriş yapılmışsa Hesabım butonu.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MapPin, Menu, X } from 'lucide-react';
import { SearchBar } from './search-bar';

interface SearchHeaderProps {
  defaultSearchValue?: string;
}

export function SearchHeader({ defaultSearchValue = '' }: SearchHeaderProps) {
  const [authState, setAuthState] = useState<{ loggedIn: boolean; role?: string }>({
    loggedIn: false,
  });
  const [mobileOpen, setMobileOpen] = useState(false);

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

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/universities-for"
              className="px-4 py-2 text-sm text-slate-300 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
            >
              Üniversiteler İçin
            </Link>
            <Link
              href="/faq"
              className="px-4 py-2 text-sm text-slate-300 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
            >
              SSS
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm text-slate-300 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-50"
            >
              Hakkında
            </Link>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            {authState.loggedIn ? (
              <Link
                href="/dashboard"
                className="ml-1 px-5 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
              >
                {authState.role === 'ADMIN' ? 'Admin Paneli' : authState.role === 'STUDENT' ? 'Öğrenci Paneli' : 'Hesabım'}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-50"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="ml-1 px-5 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[64px] bottom-0 z-[100] bg-white px-4 pt-4 overflow-y-auto border-t border-slate-200">
            <div className="space-y-1 pb-8">
              <Link href="/universities-for" className="block px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                Üniversiteler İçin
              </Link>
              <Link href="/faq" className="block px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                SSS
              </Link>
              <Link href="/about" className="block px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                Hakkında
              </Link>
              <div className="h-px bg-slate-100 my-2" />
              {authState.loggedIn ? (
                <Link href="/dashboard" className="block mx-4 mt-2 px-4 py-3 text-sm font-medium text-white text-center bg-blue-500 hover:bg-blue-400 rounded-xl" onClick={() => setMobileOpen(false)}>
                  Hesabım
                </Link>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg" onClick={() => setMobileOpen(false)}>
                    Giriş Yap
                  </Link>
                  <Link href="/register" className="block mx-4 mt-2 px-4 py-3 text-sm font-medium text-white text-center bg-blue-500 hover:bg-blue-400 rounded-xl" onClick={() => setMobileOpen(false)}>
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
