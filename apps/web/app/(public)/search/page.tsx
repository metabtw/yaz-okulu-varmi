/**
 * Arama Sonuçları Sayfası - Modern filtreleme ve grid kart görünümü.
 * Server Component: URL parametrelerinden filtreler okunur.
 */
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { SearchFilters } from '@/components/layout/search-filters';
import { SearchHeaderControls } from '@/components/layout/search-header-controls';
import {
  ChevronRight, LayoutGrid, List, SlidersHorizontal, MapPin,
  Calendar, Clock, User, Star, Heart, ArrowRight, ArrowUpDown, ChevronDown
} from 'lucide-react';
import { FavoriteButton } from '@/components/course/FavoriteButton';

export const dynamic = 'force-dynamic';

interface SearchPageProps {
  searchParams: {
    q?: string;
    city?: string;
    university?: string;
    minPrice?: string;
    maxPrice?: string;
    startDate?: string;
    page?: string;
    programType?: string;
    sortBy?: string;
    sortOrder?: string;
    view?: 'grid' | 'list';
  };
}

async function getCourses(params: Record<string, string>) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    const queryString = new URLSearchParams(params).toString();
    console.log("Fetching courses from:", `${apiUrl}/api/courses?${queryString}`); // Debug log
    const res = await fetch(`${apiUrl}/api/courses?${queryString}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch courses');
    return res.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { data: [], meta: { page: 1, limit: 10, total: 0 } };
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const page = Number(searchParams.page) || 1;
  const result = await getCourses(searchParams);
  const courses = result.data || [];
  const total = result.meta?.total || 0;
  const totalPages = Math.ceil(total / (result.meta?.limit || 10));

  return (
    <div className="min-h-screen bg-[#f9f8fc] dark:bg-[#131022]">
      <Header />
      <div className="max-w-[1440px] mx-auto w-full px-4 md:px-8 pt-24 pb-6 flex flex-col md:flex-row gap-6">

        {/* Sidebar Filters */}
        <aside className="w-full md:w-[280px] shrink-0">
          <div className="sticky top-24 self-start isolate z-30 space-y-6">


            <SearchFilters />

            {/* Promo Card (from HTML) */}
            <div className="bg-primary/5 p-5 rounded-xl border border-primary/10 hidden md:block">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">🏷️</span>
                <h4 className="text-primary font-bold">Erken Kayıt Fırsatı</h4>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Seçili yaz okullarında %20'ye varan erken kayıt indirimini kaçırmayın.
              </p>
              <button className="w-full py-2 bg-white text-primary font-semibold text-sm rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors">
                Fırsatları İncele
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Breadcrumbs & Header Controls */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#100d1c] dark:text-white font-medium">Kurslar</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[#100d1c] dark:text-white tracking-tight mb-1">
                  Yaz Okulu Programları
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  <span className="text-primary font-bold">{total}</span> Kurs Bulundu
                </p>
              </div>

              {/* Header Controls - Search, Sort, View */}
              <SearchHeaderControls 
                defaultQuery={searchParams.q} 
                defaultSort="recommended"
                defaultView={searchParams.view || 'list'}
              />
            </div>
          </div>

          {/* Course List/Grid */}
          <div className={searchParams.view === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
            : 'flex flex-col gap-4'
          }>
            {courses.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 col-span-full">
                <p className="text-slate-500">Aradığınız kriterlere uygun ders bulunamadı.</p>
              </div>
            ) : searchParams.view === 'grid' ? (
              // Grid View
              courses.map((course: any) => (
                <div key={course.id} className="group bg-white dark:bg-[#1a1625] rounded-xl border border-[#e9e7f4] dark:border-[#2d2a3b] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="w-full h-40 relative bg-slate-200">
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-primary" /> 4.8
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <FavoriteButton courseId={course.id} />
                    </div>
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-slate-300">
                      <span className="text-4xl">🎓</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded w-fit mb-2">
                      {course.code || 'Genel'}
                    </span>
                    <Link href={`/courses/${course.id}`}>
                      <h3 className="text-lg font-bold text-[#100d1c] dark:text-white mb-1 group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                        {course.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
                      {course.university?.name || 'Üniversite'}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#2d2a3b] px-2 py-1 rounded">
                        <Clock className="w-3 h-3" />
                        {course.ects} AKTS
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#2d2a3b] px-2 py-1 rounded">
                        <User className="w-3 h-3 text-green-600" />
                        {course.isOnline ? 'Online' : 'Yüzyüze'}
                      </div>
                    </div>

                    <div className="mt-auto pt-3 border-t border-gray-100 dark:border-[#2d2a3b] flex items-center justify-between">
                      <div>
                        {course.price ? (
                          <span className="text-lg font-bold text-primary">
                            {Number(course.price).toLocaleString('tr-TR')} {course.currency || 'TL'}
                          </span>
                        ) : (
                          <span className="text-lg font-bold text-primary">Ücretsiz</span>
                        )}
                      </div>
                      <Link href={`/courses/${course.id}`} className="h-8 px-3 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all">
                        Detaylar
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // List View
              courses.map((course: any) => (
                <div key={course.id} className="group bg-white dark:bg-[#1a1625] rounded-xl p-4 border border-[#e9e7f4] dark:border-[#2d2a3b] shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-5">
                  {/* Image */}
                  <div className="w-full md:w-[240px] shrink-0 h-48 md:h-auto relative rounded-lg overflow-hidden bg-slate-200">
                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary flex items-center gap-1 z-10">
                      <Star className="w-3 h-3 fill-primary" /> 4.8
                    </div>
                    {/* Placeholder color if no image */}
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-slate-300">
                      <span className="text-4xl">🎓</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          {course.code || 'Genel'}
                        </span>
                        <div className="scale-75 origin-top-right">
                          <FavoriteButton courseId={course.id} />
                        </div>
                      </div>
                      <Link href={`/courses/${course.id}`}>
                        <h3 className="text-xl font-bold text-[#100d1c] dark:text-white mb-1 group-hover:text-primary transition-colors cursor-pointer">
                          {course.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">
                        {course.university?.name || 'Üniversite'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
                        {course.description || 'Bu ders için henüz açıklama girilmemiş. Detaylı bilgi için ders sayfasını ziyaret edebilirsiniz.'}
                      </p>

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                        {course.startDate && (
                          <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#2d2a3b] px-2 py-1 rounded">
                            <Calendar className="w-4 h-4" />
                            {new Date(course.startDate).toLocaleDateString('tr-TR')}
                          </div>
                        )}
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#2d2a3b] px-2 py-1 rounded">
                          <Clock className="w-4 h-4" />
                          {course.ects} AKTS
                        </div>
                        <div className="flex items-center gap-1 bg-gray-50 dark:bg-[#2d2a3b] px-2 py-1 rounded">
                          <User className="w-4 h-4 text-green-600" />
                          {course.isOnline ? 'Online' : 'Yüzyüze'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Sidebar */}
                  <div className="w-full md:w-[200px] shrink-0 flex flex-col justify-end md:justify-center items-start md:items-end gap-2 md:border-l md:border-gray-100 dark:md:border-[#2d2a3b] md:pl-5 pt-4 md:pt-0 mt-2 md:mt-0 border-t md:border-t-0 border-gray-100 dark:border-[#2d2a3b]">
                    <div className="text-right w-full md:w-auto flex flex-row md:flex-col justify-between items-center md:items-end">
                      <div className="flex flex-col items-start md:items-end">
                        {course.price && (
                          <span className="text-2xl font-bold text-primary">
                            {Number(course.price).toLocaleString('tr-TR')} {course.currency || 'TL'}
                          </span>
                        )}
                        {!course.price && <span className="text-2xl font-bold text-primary">Ücretsiz</span>}
                        <span className="text-[10px] text-gray-400">/ Dönem</span>
                      </div>
                      <Link href={`/courses/${course.id}`} className="hidden md:flex mt-4 w-full h-10 items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-sm shadow-primary/30 transition-all">
                        Detayları Gör
                      </Link>
                    </div>
                    <Link href={`/courses/${course.id}`} className="md:hidden w-full h-10 flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-sm shadow-primary/30 transition-all">
                      Detayları Gör
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-8 mt-4">
              {/* Pagination logic here, simplified for now */}
              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={`/search?${new URLSearchParams({ ...searchParams, page: String(i + 1) }).toString()}`}
                  className={`flex items-center justify-center size-10 rounded-lg font-medium transition-colors ${page === i + 1
                    ? 'bg-primary text-white shadow-sm shadow-primary/30'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
