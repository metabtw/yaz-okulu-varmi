/**
 * FavoriteButton - Favorilere ekle butonu.
 * FavoritesContext ile tüm sayfalarda senkron çalışır.
 */
'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useFavoritesOptional } from '@/contexts/favorites-context';

interface FavoriteButtonProps {
  courseId: string;
  variant?: 'card' | 'detail';
  onAdded?: () => void;
}

export function FavoriteButton({ courseId, variant = 'card', onAdded }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const ctx = useFavoritesOptional();

  const isFavorited = ctx?.isFavorited(courseId) ?? false;
  const isStudent = ctx?.isStudent ?? false;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!ctx || !isStudent || loading) return;

    setLoading(true);
    try {
      if (isFavorited) {
        await ctx.removeFavorite(courseId);
      } else {
        await ctx.addFavorite(courseId);
        onAdded?.();
      }
    } catch {
      // Hata durumunda sessiz kal
    } finally {
      setLoading(false);
    }
  };

  if (!isStudent) return null;

  if (variant === 'card') {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="absolute top-3 right-3 p-2 rounded-lg bg-white/90 backdrop-blur-sm border border-slate-200 hover:bg-rose-50 hover:border-rose-200 transition-all z-10 disabled:opacity-50"
        aria-label={isFavorited ? 'Favorilerden kaldır' : 'Favorilere ekle'}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
          }`}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-3 px-6 border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-medium rounded-xl transition-all disabled:opacity-50"
    >
      <Heart
        className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
      />
      {isFavorited ? 'Favorilerden Kaldır' : loading ? 'İşleniyor...' : 'Favorilere Ekle'}
    </button>
  );
}
