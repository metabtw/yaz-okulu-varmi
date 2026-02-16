/**
 * FavoritesTable - Favori dersler listesi.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, ExternalLink, GitCompare } from 'lucide-react';
import { useFavoritesOptional } from '@/contexts/favorites-context';
import { useCompareOptional } from '@/contexts/compare-context';
import { studentApi } from '@/lib/api';
import { Checkbox } from '@/components/ui/checkbox';

interface Course {
  id: string;
  name: string;
  university: { name: string };
  ects: number;
  price: number | null;
  currency: string;
}

interface FavoritesTableProps {
  favorites: Course[];
  onRemoved?: () => void;
}

export function FavoritesTable({ favorites, onRemoved }: FavoritesTableProps) {
  const [items, setItems] = useState(favorites);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const ctx = useFavoritesOptional();
  const compareCtx = useCompareOptional();

  const removeFavorite = async (courseId: string) => {
    setRemovingId(courseId);
    try {
      if (ctx) {
        await ctx.removeFavorite(courseId);
      } else {
        await studentApi.removeFavorite(courseId);
      }
      setItems((prev) => prev.filter((item) => item.id !== courseId));
      onRemoved?.();
    } catch {
      setItems(favorites);
    } finally {
      setRemovingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <div
        id="favorites"
        className="rounded-2xl border border-slate-200 bg-white p-6 scroll-mt-6"
      >
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Favori Derslerim
        </h2>
        <div className="text-center py-12">
          <p className="text-slate-500 mb-4">Henüz favori ders eklemediniz</p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all"
          >
            Ders Ara
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      id="favorites"
      className="rounded-2xl border border-slate-200 bg-white p-6 scroll-mt-6"
    >
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Favori Derslerim ({items.length})
      </h2>
      <div className="space-y-2">
        {items.map((course) => (
          <div
            key={course.id}
            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-slate-900 truncate">{course.name}</h4>
              <p className="text-sm text-slate-500">
                {course.university.name} • {course.ects} AKTS •{' '}
                {course.price != null ? `${course.price} ${course.currency}` : 'Ücretsiz'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              {compareCtx && (
                <div
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    id={`fav-compare-${course.id}`}
                    checked={compareCtx.isInCompare(course.id)}
                    onCheckedChange={(checked) => {
                      if (checked) compareCtx.addToCompare(course.id);
                      else compareCtx.removeFromCompare(course.id);
                    }}
                    disabled={!compareCtx.isInCompare(course.id) && !compareCtx.canAddMore}
                  />
                  <label
                    htmlFor={`fav-compare-${course.id}`}
                    className="text-xs text-slate-600 cursor-pointer flex items-center gap-1"
                  >
                    <GitCompare className="w-3 h-3" />
                    Karşılaştır
                  </label>
                </div>
              )}
              <Link
                href={`/courses/${course.id}`}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Detay gör"
              >
                <ExternalLink className="h-4 w-4 text-slate-500" />
              </Link>
              <button
                type="button"
                onClick={() => removeFavorite(course.id)}
                disabled={removingId === course.id}
                className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                aria-label="Favoriden kaldır"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
