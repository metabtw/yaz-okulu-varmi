/**
 * SearchFilters - Arama sayfasi sol sidebar filtreleri.
 * Sehir, AKTS araligi, ucret araligi, online/yuzyuze secimi.
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      params.delete('page');
      return params.toString();
    },
    [searchParams],
  );

  const updateFilter = (name: string, value: string) => {
    router.push(`/search?${createQueryString(name, value)}`);
  };

  const cities = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa', 'Eskisehir'];

  return (
    <div className="space-y-6">
      {/* City Filter */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          Sehir
        </label>
        <select
          value={searchParams.get('city') || ''}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Tum Sehirler</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Online/Yuzyuze */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          Egitim Formati
        </label>
        <div className="flex gap-2">
          {[
            { label: 'Tumu', value: '' },
            { label: 'Online', value: 'true' },
            { label: 'Yuzyuze', value: 'false' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateFilter('isOnline', opt.value)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                (searchParams.get('isOnline') || '') === opt.value
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* AKTS Range */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          AKTS Araligi
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={searchParams.get('minEcts') || ''}
            onChange={(e) => updateFilter('minEcts', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <span className="text-slate-300 text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={searchParams.get('maxEcts') || ''}
            onChange={(e) => updateFilter('maxEcts', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          Ucret Araligi (TL)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={searchParams.get('minPrice') || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <span className="text-slate-300 text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={searchParams.get('maxPrice') || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => router.push('/search')}
        className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
      >
        Filtreleri Temizle
      </button>
    </div>
  );
}
