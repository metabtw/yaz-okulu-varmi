/**
 * Search Header Controls - Sıralama, Görünüm ve Arama kontrolleri.
 * Client component - URL parametrelerini günceller.
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ArrowUpDown, ChevronDown, LayoutGrid, List } from 'lucide-react';

interface SearchHeaderControlsProps {
  defaultQuery?: string;
  defaultSort?: string;
  defaultView?: 'grid' | 'list';
}

const sortOptions = [
  { value: 'recommended', label: 'Önerilen' },
  { value: 'price_asc', label: 'Fiyat (Düşükten Yükseğe)' },
  { value: 'price_desc', label: 'Fiyat (Yüksekten Düşüğe)' },
  { value: 'name_asc', label: 'İsim (A-Z)' },
  { value: 'name_desc', label: 'İsim (Z-A)' },
  { value: 'date_asc', label: 'Tarih (Yakın)' },
  { value: 'date_desc', label: 'Tarih (Uzak)' },
];

export function SearchHeaderControls({ 
  defaultQuery = '', 
  defaultSort = 'recommended',
  defaultView = 'list' 
}: SearchHeaderControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL'den mevcut sort parametrelerini al
  const urlSortBy = searchParams.get('sortBy');
  const urlSortOrder = searchParams.get('sortOrder');
  
  // URL parametrelerinden sort value'yu hesapla
  const getSortValueFromURL = (): string => {
    if (!urlSortBy) return 'recommended';
    if (urlSortBy === 'price' && urlSortOrder === 'asc') return 'price_asc';
    if (urlSortBy === 'price' && urlSortOrder === 'desc') return 'price_desc';
    if (urlSortBy === 'name' && urlSortOrder === 'asc') return 'name_asc';
    if (urlSortBy === 'name' && urlSortOrder === 'desc') return 'name_desc';
    if (urlSortBy === 'startDate' && urlSortOrder === 'asc') return 'date_asc';
    if (urlSortBy === 'startDate' && urlSortOrder === 'desc') return 'date_desc';
    return 'recommended';
  };
  
  const [query, setQuery] = useState(searchParams.get('q') || defaultQuery);
  const [sortBy, setSortBy] = useState(getSortValueFromURL());
  const [view, setView] = useState<'grid' | 'list'>(searchParams.get('view') as 'grid' | 'list' || defaultView);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // URL değiştiğinde state'leri güncelle
  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setSortBy(getSortValueFromURL());
    setView(searchParams.get('view') as 'grid' | 'list' || defaultView);
  }, [searchParams]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update URL with new parameters
  const updateURL = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateURL({ q: query.trim() });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsDropdownOpen(false);
    
    // Map sort value to API parameters
    let sortParam = 'name';
    let orderParam = 'asc';
    
    switch (value) {
      case 'price_asc':
        sortParam = 'price';
        orderParam = 'asc';
        break;
      case 'price_desc':
        sortParam = 'price';
        orderParam = 'desc';
        break;
      case 'name_asc':
        sortParam = 'name';
        orderParam = 'asc';
        break;
      case 'name_desc':
        sortParam = 'name';
        orderParam = 'desc';
        break;
      case 'date_asc':
        sortParam = 'startDate';
        orderParam = 'asc';
        break;
      case 'date_desc':
        sortParam = 'startDate';
        orderParam = 'desc';
        break;
      default:
        sortParam = 'name';
        orderParam = 'asc';
    }
    
    updateURL({ sortBy: sortParam, sortOrder: orderParam });
  };

  // Handle view change
  const handleViewChange = (newView: 'grid' | 'list') => {
    setView(newView);
    updateURL({ view: newView });
  };

  const currentSortLabel = sortOptions.find(opt => opt.value === sortBy)?.label || 'Önerilen';

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
      {/* Search Bar with Button */}
      <form onSubmit={handleSearch} className="flex-1 max-w-lg">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ders veya üniversite ara..."
            className="w-full h-10 pl-10 pr-20 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 h-7 px-3 bg-primary hover:bg-primary/90 text-white text-xs font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            Ara
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 h-10 px-4 bg-white dark:bg-[#1a1625] border border-[#e9e7f4] dark:border-[#2d2a3b] rounded-lg text-sm font-medium text-[#100d1c] dark:text-white hover:border-primary/50 transition-colors"
          >
            <ArrowUpDown className="w-4 h-4" />
            <span className="hidden sm:inline">Sırala:</span> {currentSortLabel}
            <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#1a1625] border border-[#e9e7f4] dark:border-[#2d2a3b] rounded-lg shadow-lg py-1 z-50">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-[#2d2a3b] transition-colors ${
                    sortBy === option.value 
                      ? 'text-primary font-medium bg-primary/5' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Toggles */}
        <div className="flex bg-white dark:bg-[#1a1625] border border-[#e9e7f4] dark:border-[#2d2a3b] rounded-lg p-1 h-10">
          <button 
            aria-label="Grid Görünümü" 
            onClick={() => handleViewChange('grid')}
            className={`w-9 flex items-center justify-center rounded transition-all ${
              view === 'grid' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-[#2d2a3b]'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button 
            aria-label="Liste Görünümü" 
            onClick={() => handleViewChange('list')}
            className={`w-9 flex items-center justify-center rounded transition-all ${
              view === 'list' 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-[#2d2a3b]'
            }`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
