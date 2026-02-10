/**
 * SearchFilters - Arama sayfası sol panel filtreleri.
 * Client Component: Filtre değişikliklerinde URL güncellenir.
 */
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [isOnline, setIsOnline] = useState(searchParams.get('isOnline') || '');
  const [minEcts, setMinEcts] = useState(searchParams.get('minEcts') || '');
  const [maxEcts, setMaxEcts] = useState(searchParams.get('maxEcts') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const applyFilters = () => {
    const params = new URLSearchParams();
    const q = searchParams.get('q');
    if (q) params.set('q', q);
    if (city) params.set('city', city);
    if (isOnline) params.set('isOnline', isOnline);
    if (minEcts) params.set('minEcts', minEcts);
    if (maxEcts) params.set('maxEcts', maxEcts);
    if (maxPrice) params.set('maxPrice', maxPrice);

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    setCity('');
    setIsOnline('');
    setMinEcts('');
    setMaxEcts('');
    setMaxPrice('');
    const q = searchParams.get('q');
    router.push(q ? `/search?q=${q}` : '/search');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-5">
      <h3 className="font-semibold text-base mb-4">Filtreler</h3>

      {/* Şehir */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1.5">Şehir</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Örn: İstanbul"
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Eğitim Türü */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1.5">Eğitim Türü</label>
        <select
          value={isOnline}
          onChange={(e) => setIsOnline(e.target.value)}
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Tümü</option>
          <option value="true">Uzaktan Eğitim</option>
          <option value="false">Yüz Yüze</option>
        </select>
      </div>

      {/* AKTS Aralığı */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1.5">AKTS Aralığı</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={minEcts}
            onChange={(e) => setMinEcts(e.target.value)}
            placeholder="Min"
            min={1}
            max={30}
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <input
            type="number"
            value={maxEcts}
            onChange={(e) => setMaxEcts(e.target.value)}
            placeholder="Max"
            min={1}
            max={30}
            className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Maksimum Ücret */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1.5">Maks. Ücret (TL)</label>
        <input
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          placeholder="Örn: 5000"
          min={0}
          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Butonlar */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={applyFilters}
          className="flex-1 h-9 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Filtrele
        </button>
        <button
          type="button"
          onClick={clearFilters}
          className="h-9 px-3 rounded-md bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
        >
          Temizle
        </button>
      </div>
    </div>
  );
}
