/**
 * SearchBar - Glassmorphism arama kutusu.
 * Hero section ve search page'de kullanilir.
 * variant="hero": buyuk, koyu arka plan uzerinde cam efekti
 * variant="compact": search page header icin
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  defaultValue?: string;
}

export function SearchBar({ variant = 'hero', defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  // Sync with external changes (only when not focused to avoid overwriting user typing)
  // This prevents multiple SearchBar instances from overwriting each other or creating loops
  useEffect(() => {
    if (!isFocused) {
      setQuery(defaultValue);
    }
  }, [defaultValue, isFocused]);

  // Live search debouncing
  useEffect(() => {
    // Only search if query changed from what it was initialized with/synced to
    if (query === defaultValue) return;

    const timer = setTimeout(() => {
      router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [query, router, defaultValue]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : '/search');
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ders veya üniversite ara..."
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="relative flex items-center glass-light rounded-2xl p-1.5 glow-border">
          <Search className="absolute left-5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Hangi dersi veya üniversiteyi arıyorsun? (Örn: Lineer Cebir)"
            className="w-full h-14 pl-13 pr-36 rounded-xl bg-slate-50 text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all border border-transparent focus:border-blue-500/50"
            style={{ paddingLeft: '3rem' }}
          />
          <button
            type="submit"
            className="absolute right-2.5 inline-flex items-center gap-2 rounded-xl h-11 px-6 bg-blue-500 hover:bg-blue-400 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Ara</span>
          </button>
        </div>
      </div>
    </form>
  );
}
