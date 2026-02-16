/**
 * Arama Sonuçları Sayfası - Modern filtreleme ve grid kart görünümü.
 * Server Component: URL parametrelerinden filtreler okunur.
 */
import Link from 'next/link';
import { SearchBar } from '@/components/layout/search-bar';
import { SearchFilters } from '@/components/layout/search-filters';
import { CourseCard } from '@/components/layout/course-card';
import { SearchHeader } from '@/components/layout/search-header';
import { Footer } from '@/components/layout/footer';
import { MapPin, SlidersHorizontal } from 'lucide-react';

interface SearchPageProps {
  searchParams: {
    q?: string;
    city?: string;
    isOnline?: string;
    minEcts?: string;
    maxEcts?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  };
}

/** Backend'den ders arama sonuçlarını çeker */
async function searchCourses(params: Record<string, string>) {
  try {
    const query = new URLSearchParams(params).toString();
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/courses?${query}`, {
      cache: 'no-store',
    });

    if (!res.ok) return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
    return res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, limit: 20, totalPages: 0 } };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params: Record<string, string> = {};
  if (searchParams.q) params.q = searchParams.q;
  if (searchParams.city) params.city = searchParams.city;
  if (searchParams.isOnline) params.isOnline = searchParams.isOnline;
  if (searchParams.minEcts) params.minEcts = searchParams.minEcts;
  if (searchParams.maxEcts) params.maxEcts = searchParams.maxEcts;
  if (searchParams.minPrice) params.minPrice = searchParams.minPrice;
  if (searchParams.maxPrice) params.maxPrice = searchParams.maxPrice;
  if (searchParams.page) params.page = searchParams.page;

  const result = await searchCourses(params);

  return (
    <main className="min-h-screen bg-slate-50/50">
      <SearchHeader defaultSearchValue={searchParams.q || ''} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar: Filtreler */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-semibold text-slate-900">Filtreler</h3>
              </div>
              <SearchFilters />
            </div>
          </aside>

          {/* Main: Sonuçlar */}
          <div className="flex-1 min-w-0">
            {/* Sonuç bilgisi */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-slate-500">
                {searchParams.q && (
                  <span>
                    &quot;<span className="font-medium text-slate-700">{searchParams.q}</span>&quot; için{' '}
                  </span>
                )}
                <span className="font-semibold text-slate-900">{result.meta?.total || 0}</span> sonuç bulundu
              </p>
            </div>

            {/* Ders Kartları Grid - geniş kartlar (2 sütun) */}
            {result.data && result.data.length > 0 ? (
              <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-5">
                {result.data.map((course: Record<string, unknown>) => (
                  <CourseCard key={course.id as string} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-lg font-semibold text-slate-900 mb-2">Sonuç bulunamadı</p>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Farklı anahtar kelimeler veya daha geniş filtreler deneyin.
                </p>
              </div>
            )}

            {/* Sayfalama */}
            {result.meta && result.meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: result.meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/search?${new URLSearchParams({ ...params, page: String(pageNum) }).toString()}`}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        pageNum === (result.meta?.page || 1)
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-500'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
