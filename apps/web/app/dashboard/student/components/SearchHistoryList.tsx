/**
 * SearchHistoryList - Son aramalar listesi.
 */
'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';

interface SearchLog {
  id: string;
  searchQuery: string | null;
  filters: Record<string, unknown>;
  resultCount: number;
  createdAt: string;
}

interface SearchHistoryListProps {
  history: SearchLog[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dk önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return 'Dün';
  return date.toLocaleDateString('tr-TR');
}

function buildSearchUrl(log: SearchLog): string {
  const params = new URLSearchParams();
  if (log.searchQuery) params.set('q', log.searchQuery);
  const filters = log.filters || {};
  if (filters.city) params.set('city', String(filters.city));
  if (filters.isOnline !== undefined) params.set('isOnline', String(filters.isOnline));
  if (filters.minEcts) params.set('minEcts', String(filters.minEcts));
  if (filters.maxEcts) params.set('maxEcts', String(filters.maxEcts));
  if (filters.minPrice) params.set('minPrice', String(filters.minPrice));
  if (filters.maxPrice) params.set('maxPrice', String(filters.maxPrice));
  return `/search?${params.toString()}`;
}

export function SearchHistoryList({ history }: SearchHistoryListProps) {
  const displayItems = history.slice(0, 5);

  if (displayItems.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Son Aramalar
        </h2>
        <p className="text-slate-500 text-center py-8">
          Henüz arama geçmişiniz yok. Giriş yaparak arama yaptığınızda burada
          görünecek.
        </p>
        <div className="text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all"
          >
            <Search className="w-4 h-4" />
            Ders Ara
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Son Aramalar</h2>
        <Link
          href="/dashboard/student/search-history"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Tümünü Gör
        </Link>
      </div>
      <div className="space-y-2">
        {displayItems.map((log) => (
          <div
            key={log.id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate">
                {log.searchQuery || '(Filtre araması)'}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {log.filters &&
                  Object.entries(log.filters)
                    .filter(([, v]) => v != null && v !== '')
                    .map(([k, v]) => (
                      <span
                        key={k}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                      >
                        {k}: {String(v)}
                      </span>
                    ))}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-2">
              <span className="text-sm text-slate-500">
                {log.resultCount} sonuç
              </span>
              <span className="text-xs text-slate-400">
                {formatDate(log.createdAt)}
              </span>
              <Link
                href={buildSearchUrl(log)}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Tekrar Ara
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
