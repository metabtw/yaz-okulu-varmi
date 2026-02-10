/**
 * SearchBar - Ana sayfa ve arama sayfasında kullanılan arama çubuğu.
 * Client Component: Kullanıcı etkileşimi (form submit) gerektirir.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        {/* Arama ikonu */}
        <svg
          className="absolute left-4 h-5 w-5 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ders adı, kodu veya üniversite ara..."
          className="w-full h-14 pl-12 pr-32 rounded-xl border border-border bg-white text-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-base"
        />

        <button
          type="submit"
          className="absolute right-2 inline-flex items-center justify-center rounded-lg h-10 px-6 bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Ara
        </button>
      </div>
    </form>
  );
}
