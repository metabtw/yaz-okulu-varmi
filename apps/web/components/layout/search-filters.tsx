/**
 * SearchFilters - Arama sayfasi sol sidebar filtreleri.
 * Sehir, AKTS araligi, ucret araligi, online/yuzyuze secimi.
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { SearchBar } from '@/components/layout/search-bar';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(true);

  // Local state for debounced inputs
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('minPrice') || '',
    max: searchParams.get('maxPrice') || ''
  });
  const [ectsRange, setEctsRange] = useState({
    min: searchParams.get('minEcts') || '',
    max: searchParams.get('maxEcts') || ''
  });

  // Sync local state when URL params change (e.g. clear filters)
  useEffect(() => {
    setPriceRange({
      min: searchParams.get('minPrice') || '',
      max: searchParams.get('maxPrice') || ''
    });
    setEctsRange({
      min: searchParams.get('minEcts') || '',
      max: searchParams.get('maxEcts') || ''
    });
  }, [searchParams]);

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([name, value]) => {
        if (value) params.set(name, value);
        else params.delete(name);
      });
      params.delete('page');
      return params.toString();
    },
    [searchParams],
  );

  const updateFilter = (name: string, value: string) => {
    router.push(`/search?${createQueryString({ [name]: value })}`);
  };

  const updateFilters = (updates: Record<string, string>) => {
    router.push(`/search?${createQueryString(updates)}`);
  };

  // No debounce effects for Price/ECTS anymore. Manual apply.

  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Eskişehir'];

  const applyRangeFilters = () => {
    updateFilters({
      minEcts: ectsRange.min,
      maxEcts: ectsRange.max,
      minPrice: priceRange.min,
      maxPrice: priceRange.max
    });
  };

  // Filter content - reused for both mobile sheet and desktop sidebar
  // Using a variable instead of a component to avoid re-mounting input fields on state change,
  // which causes focus loss.
  const filterContent = (
    <div className="space-y-6">
      {/* City Filter */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          Şehir
        </label>
        <select
          value={searchParams.get('city') || ''}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
        >
          <option value="">Tüm Şehirler</option>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* Online/Yuzyuze */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          Eğitim Formatı
        </label>
        <div className="flex gap-2">
          {[
            { label: 'Tümü', value: '' },
            { label: 'Online', value: 'true' },
            { label: 'Yüzyüze', value: 'false' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => updateFilter('isOnline', opt.value)}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-medium transition-all ${(searchParams.get('isOnline') || '') === opt.value
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* AKTS Range - Manual Apply */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          AKTS Aralığı
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={ectsRange.min}
            onChange={(e) => setEctsRange(prev => ({ ...prev, min: e.target.value }))}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <span className="text-slate-300 text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={ectsRange.max}
            onChange={(e) => setEctsRange(prev => ({ ...prev, max: e.target.value }))}
            className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Price Range - Manual Apply */}
      <div>
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
          Ücret Aralığı (TL)
        </label>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            <span className="text-slate-300 text-sm">-</span>
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <button
            onClick={applyRangeFilters}
            className="w-full py-2 bg-blue-500 text-white font-medium text-sm rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-600 active:scale-95 transition-all"
          >
            Filtreleri Uygula
          </button>
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          router.push('/search');
          setMobileOpen(false);
        }}
        className="w-full py-2.5 px-4 rounded-xl text-sm font-medium text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all"
      >
        Filtreleri Temizle
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Trigger */}
      <div className="lg:hidden sticky top-20 z-40 mb-4 bg-background-light/80 backdrop-blur-md py-2 px-1 -mx-1 flex flex-col gap-2">
        <SearchBar variant="compact" defaultValue={searchParams.get('q') || ''} />
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 shadow-sm hover:border-primary/50 transition-all"
        >
          <Filter className="w-4 h-4" />
          Filtrele
        </button>
      </div>

      {/* Mobile Sheet (Overlay + Sidebar) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl flex flex-col h-full transform transition-transform">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Filtrele</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {filterContent}
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Collapsible) */}
      <div className="hidden lg:block space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900">Filtreler</h3>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-50 transition-colors"
          >
            {filtersOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${filtersOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {filterContent}
        </div>
      </div>
    </>
  );
}
