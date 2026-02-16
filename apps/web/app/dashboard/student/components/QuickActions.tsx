/**
 * QuickActions - Hızlı erişim butonları.
 */
'use client';

import Link from 'next/link';
import { Search, Heart, GitCompare } from 'lucide-react';

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/search"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all shadow-sm hover:shadow-md"
      >
        <Search className="w-4 h-4" />
        Yeni Arama Yap
      </Link>
      <a
        href="#favorites"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium hover:bg-slate-50 transition-all"
      >
        <Heart className="w-4 h-4" />
        Favorilerim
      </a>
      <button
        type="button"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium hover:bg-slate-50 transition-all"
        aria-label="Karşılaştır"
      >
        <GitCompare className="w-4 h-4" />
        Karşılaştır
      </button>
    </div>
  );
}
