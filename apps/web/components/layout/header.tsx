/**
 * Header - Sleek, transparent navigation bar.
 * Sayfanın üstünde sabitlenir, scroll'da arka plan belirginleşir.
 */
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

  // Header background logic:
  // - If scrolled: Dark glass effect (existing behavior)
  // - If NOT scrolled AND on Home: Transparent
  // - If NOT scrolled AND NOT on Home: Solid Dark (to ensure readability on white/light pages)
  const headerClass = scrolled
    ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/5'
    : isHome
      ? 'bg-transparent'
      : 'bg-slate-950 border-b border-white/5';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
              <MapPin className="w-5 h-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
              Yaz Okulu Var mı?
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="/universities-for"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Üniversiteler İçin
            </Link>
            <Link
              href="/faq"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Sıkça Sorulan Sorular
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              Hakkında
            </Link>
            <div className="w-px h-6 bg-white/10 mx-2" />
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
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-white/5"
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
            className="lg:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[64px] bottom-0 z-[100] bg-slate-950 px-4 pt-4 overflow-y-auto border-t border-white/5">
            <div className="space-y-1 pb-8">
              <Link href="/universities-for" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMobileOpen(false)}>
                Üniversiteler İçin
              </Link>
              <Link href="/faq" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMobileOpen(false)}>
                SSS
              </Link>
              <Link href="/about" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMobileOpen(false)}>
                Hakkında
              </Link>
              <div className="h-px bg-white/5 my-2" />
              {isLoggedIn ? (
                <Link href="/dashboard" className="block mx-4 mt-2 px-4 py-3 text-sm font-medium text-white text-center bg-blue-500 hover:bg-blue-400 rounded-xl" onClick={() => setMobileOpen(false)}>
                  Hesabım
                </Link>
              ) : (
                <>
                  <Link href="/login" className="block px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-white/5 rounded-lg" onClick={() => setMobileOpen(false)}>
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
