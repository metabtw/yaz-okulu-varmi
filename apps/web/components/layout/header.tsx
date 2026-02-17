'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MapPin, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }
  }, []);

  // Mobil menü açıkken body kaymasını engelle
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileOpen]);

  // Determine header appearance
  const isLightHeader = (!isHome || scrolled) && !mobileOpen;

  const headerClass = mobileOpen
    ? 'bg-slate-950 border-b border-white/5'
    : isLightHeader
      ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm'
      : 'bg-transparent';

  const textColorClass = isLightHeader
    ? 'text-black-600 hover:text-white'
    : 'text-black-300 hover:text-white';

  const logoTextClass = isLightHeader
    ? 'text-slate-900'
    : 'text-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                <MapPin className="w-5 h-5 text-white" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
              </div>
              <span className={`text-lg font-bold tracking-tight hidden sm:block transition-colors ${logoTextClass}`}>
                Yaz Okulu Var mı?
              </span>
            </Link>

            {/* Desktop Navigasyon */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/universities-for"
                className={`px-4 py-2 text-sm transition-colors rounded-lg hover:bg-blue-500 ${textColorClass}`}
              >
                Üniversiteler İçin
              </Link>
              <Link
                href="/faq"
                className={`px-4 py-2 text-sm transition-colors rounded-lg hover:bg-blue-500 ${textColorClass}`}
              >
                Sıkça Sorulan Sorular
              </Link>
              <Link
                href="/about"
                className={`px-4 py-2 text-sm transition-colors rounded-lg hover:bg-blue-500 ${textColorClass}`}
              >
                Hakkında
              </Link>
              <div className={`w-px h-6 mx-2 ${isLightHeader ? 'bg-slate-200' : 'bg-white/10'}`} />
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="ml-1 px-5 py-2.5 text-sm font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  Hesabım
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-4 py-2 text-sm transition-colors rounded-lg hover:bg-blue-500 ${textColorClass}`}
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

            {/* Mobil Menü Butonu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden relative p-2 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 transition-all active:scale-95"
              aria-label="Menüyü Aç/Kapat"
            >
              {mobileOpen ? (
                <X className="w-6 h-6" strokeWidth={2.5} />
              ) : (
                <Menu className="w-6 h-6" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobil Menü İçeriği - Header Dışında */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950 px-4 pt-24 overflow-y-auto"
        >
          <div className="space-y-1 pb-8">
            <Link
              href="/universities-for"
              className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Üniversiteler İçin
            </Link>
            <Link
              href="/faq"
              className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              SSS
            </Link>
            <Link
              href="/about"
              className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Hakkında
            </Link>
            <div className="h-px bg-white/5 my-2" />
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="block mx-4 mt-2 px-4 py-3 text-sm font-medium text-white text-center bg-blue-500 hover:bg-blue-400 rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                Hesabım
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg"
                  onClick={() => setMobileOpen(false)}
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="block mx-4 mt-2 px-4 py-3 text-sm font-medium text-white text-center bg-blue-500 hover:bg-blue-400 rounded-xl"
                  onClick={() => setMobileOpen(false)}
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}