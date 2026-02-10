/**
 * Arama Sonuçları Sayfası - Filtreleme ve listeleme.
 * Server Component: URL parametrelerinden filtreler okunur.
 * Sonuçlar backend'den fetch edilir.
 */
import Link from 'next/link';
import { SearchBar } from '@/components/layout/search-bar';
import { SearchFilters } from '@/components/layout/search-filters';
import { CourseCard } from '@/components/layout/course-card';

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
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-primary shrink-0">
              YOV?
            </Link>
            <div className="flex-1">
              <SearchBar />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol: Filtreler */}
          <aside className="lg:w-64 shrink-0">
            <SearchFilters />
          </aside>

          {/* Sağ: Sonuçlar */}
          <div className="flex-1">
            {/* Sonuç bilgisi */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {searchParams.q && (
                  <span>
                    &quot;<strong>{searchParams.q}</strong>&quot; için{' '}
                  </span>
                )}
                <strong>{result.meta?.total || 0}</strong> sonuç bulundu
              </p>
            </div>

            {/* Ders Kartları */}
            {result.data && result.data.length > 0 ? (
              <div className="grid gap-4">
                {result.data.map((course: Record<string, unknown>) => (
                  <CourseCard key={course.id as string} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-lg text-muted-foreground">Aramanıza uygun ders bulunamadı.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Farklı anahtar kelimeler veya daha geniş filtreler deneyin.
                </p>
              </div>
            )}

            {/* Sayfalama */}
            {result.meta && result.meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: result.meta.totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/search?${new URLSearchParams({ ...params, page: String(pageNum) }).toString()}`}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-md text-sm ${
                        pageNum === (result.meta?.page || 1)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
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
    </main>
  );
}
