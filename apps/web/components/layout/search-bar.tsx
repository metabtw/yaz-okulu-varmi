/**
 * SearchBar - Glassmorphism arama kutusu.
 * Hero section ve search page'de kullanilir.
 * variant="hero": buyuk, koyu arka plan uzerinde cam efekti
 * variant="compact": search page header icin
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface SearchBarProps {
  variant?: 'hero' | 'compact';
  defaultValue?: string;
}

export function SearchBar({ variant = 'hero', defaultValue = '' }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
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
            placeholder="Hangi dersi veya üniversiteyi arıyorsun? (Örn: Lineer Cebir)"
            className="w-full h-14 pl-13 pr-36 rounded-xl bg-white/[0.07] text-white placeholder:text-slate-400 text-base focus:outline-none focus:bg-white/[0.1] transition-colors"
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
