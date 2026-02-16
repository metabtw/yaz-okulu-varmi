/**
 * Arama Geçmişi - Öğrencinin tüm arama geçmişi.
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { studentApi } from '@/lib/api';
import { Search, ArrowLeft } from 'lucide-react';

interface SearchLog {
  id: string;
  searchQuery: string | null;
  filters: Record<string, unknown>;
  resultCount: number;
  createdAt: string;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('tr-TR');
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

export default function SearchHistoryPage() {
  const [history, setHistory] = useState<SearchLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentApi
      .getSearchHistory()
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/student"
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Arama Geçmişim</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : history.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-4">Henüz arama geçmişiniz yok</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600"
          >
            Ders Ara
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="divide-y divide-slate-100">
            {history.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-slate-900">
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
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <span className="text-sm text-slate-500">
                    {log.resultCount} sonuç
                  </span>
                  <span className="text-sm text-slate-400">
                    {formatDate(log.createdAt)}
                  </span>
                  <Link
                    href={buildSearchUrl(log)}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
                  >
                    Tekrar Ara
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
