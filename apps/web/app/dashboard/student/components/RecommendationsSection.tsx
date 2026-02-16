/**
 * RecommendationsSection - Size özel önerilen dersler.
 */
'use client';

import Link from 'next/link';
import { BookOpen, Coins, Globe, GitCompare } from 'lucide-react';
import { useFavoritesOptional } from '@/contexts/favorites-context';
import { useCompareOptional } from '@/contexts/compare-context';
import { studentApi } from '@/lib/api';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface Course {
  id: string;
  name: string;
  code: string;
  ects: number;
  price: number | null;
  currency: string;
  isOnline: boolean;
  university: { id: string; name: string; city: string };
}

interface RecommendationsSectionProps {
  courses: Course[];
  onFavoriteAdded?: () => void;
}

export function RecommendationsSection({
  courses,
  onFavoriteAdded,
}: RecommendationsSectionProps) {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [localCourses, setLocalCourses] = useState(courses);
  const ctx = useFavoritesOptional();
  const compareCtx = useCompareOptional();

  const handleAddFavorite = async (courseId: string) => {
    setAddingId(courseId);
    try {
      if (ctx) {
        await ctx.addFavorite(courseId);
      } else {
        await studentApi.addFavorite(courseId);
      }
      setLocalCourses((prev) => prev.filter((c) => c.id !== courseId));
      onFavoriteAdded?.();
    } catch {
      // Hata durumunda sessiz kal
    } finally {
      setAddingId(null);
    }
  };

  if (localCourses.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Sizin İçin Seçtiklerimiz
        </h2>
        <p className="text-slate-500 text-center py-8">
          Henüz öneri için yeterli veri yok. Ders arayıp inceledikçe size özel
          öneriler göreceksiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Sizin İçin Seçtiklerimiz
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 scrollbar-thin">
        {localCourses.map((course) => (
          <div
            key={course.id}
            className="min-w-[280px] max-w-[280px] rounded-xl border border-slate-200 p-4 hover:border-blue-200 transition-colors flex flex-col"
          >
            <Link href={`/courses/${course.id}`} className="flex-1">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">
                    {course.name}
                  </h3>
                  <p className="text-sm text-slate-500">{course.university.name}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {course.ects} AKTS
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${
                    course.isOnline ? 'bg-violet-50 text-violet-700' : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  {course.isOnline ? 'Online' : 'Yüz Yüze'}
                </span>
                {course.price != null && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    <Coins className="w-3 h-3" />
                    {course.price} {course.currency}
                  </span>
                )}
              </div>
            </Link>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleAddFavorite(course.id)}
                disabled={addingId === course.id}
                className="flex-1 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {addingId === course.id ? 'Ekleniyor...' : 'Favorilere Ekle'}
              </button>
              {compareCtx && (
                <div
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    id={`rec-compare-${course.id}`}
                    checked={compareCtx.isInCompare(course.id)}
                    onCheckedChange={(checked) => {
                      if (checked) compareCtx.addToCompare(course.id);
                      else compareCtx.removeFromCompare(course.id);
                    }}
                    disabled={!compareCtx.isInCompare(course.id) && !compareCtx.canAddMore}
                  />
                  <label
                    htmlFor={`rec-compare-${course.id}`}
                    className="text-xs text-slate-600 cursor-pointer flex items-center gap-1"
                  >
                    <GitCompare className="w-3 h-3" />
                    Karşılaştır
                  </label>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
