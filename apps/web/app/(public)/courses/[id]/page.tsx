/**
 * Ders Detay Sayfasi - Split layout (2/3 main, 1/3 sticky sidebar).
 * Ders bilgileri, mufredat, ucret ve basvuru linki.
 */
import Link from 'next/link';
import { Footer } from '@/components/layout/footer';
import { TrackCourseView } from '@/components/course/TrackCourseView';
import { FavoriteButton } from '@/components/course/FavoriteButton';
import { CompareButton } from '@/components/course/CompareButton';
import {
  MapPin, BookOpen, Globe, Calendar, ExternalLink, ArrowLeft,
  Clock, GraduationCap, Building2, CheckCircle2, Coins, Users
} from 'lucide-react';

interface CourseDetailProps {
  params: { id: string };
}

async function getCourse(id: string) {
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:4000';
    const res = await fetch(`${apiUrl}/api/courses/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function CourseDetailPage({ params }: CourseDetailProps) {
  const course = await getCourse(params.id);

  if (!course) {
    return (
      <main className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 mb-2">Ders bulunamadi</p>
          <Link href="/search" className="text-blue-500 hover:underline text-sm">Arama sayfasina don</Link>
        </div>
      </main>
    );
  }

  const university = course.university;

  return (
    <main className="min-h-screen bg-slate-50/50">
      <TrackCourseView courseId={course.id} />
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/search" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Aramaya Don</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content (2/3) */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Course Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
                  {course.code}
                </span>
                {course.isOnline ? (
                  <span className="px-3 py-1 rounded-lg bg-violet-50 text-violet-600 text-xs font-medium flex items-center gap-1">
                    <Globe className="w-3 h-3" /> Online
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 text-xs font-medium flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Yuzyuze
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                {course.name}
              </h1>

              {university && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{university.name}</p>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{university.city}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 ml-2" />
                      <span className="text-emerald-600">Onayli</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-50">
                  <BookOpen className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{course.ects}</p>
                  <p className="text-xs text-slate-500">AKTS Kredi</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <Coins className="w-5 h-5 text-emerald-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">
                    {course.price ? `${Number(course.price).toLocaleString('tr-TR')}` : 'Ucretsiz'}
                  </p>
                  <p className="text-xs text-slate-500">{course.currency || 'TRY'}</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <Users className="w-5 h-5 text-violet-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{course.quota || '-'}</p>
                  <p className="text-xs text-slate-500">Kontenjan</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <Globe className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{course.isOnline ? 'Online' : 'Kampus'}</p>
                  <p className="text-xs text-slate-500">Egitim Formati</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {course.description && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Ders Hakkinda</h2>
                <p className="text-slate-600 leading-relaxed">{course.description}</p>
              </div>
            )}

            {/* Course Schedule */}
            {(course.startDate || course.endDate) && (
              <div className="bg-white rounded-2xl border border-slate-200 p-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Ders Takvimi
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left py-3 px-4 font-medium text-slate-500">Bilgi</th>
                        <th className="text-left py-3 px-4 font-medium text-slate-500">Tarih</th>
                      </tr>
                    </thead>
                    <tbody>
                      {course.startDate && (
                        <tr className="border-b border-slate-50">
                          <td className="py-3 px-4 text-slate-600">Baslangic Tarihi</td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {new Date(course.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </td>
                        </tr>
                      )}
                      {course.endDate && (
                        <tr className="border-b border-slate-50">
                          <td className="py-3 px-4 text-slate-600">Bitis Tarihi</td>
                          <td className="py-3 px-4 font-medium text-slate-900">
                            {new Date(course.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </td>
                        </tr>
                      )}
                      <tr>
                        <td className="py-3 px-4 text-slate-600">Sure</td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {course.startDate && course.endDate
                              ? `${Math.ceil((new Date(course.endDate).getTime() - new Date(course.startDate).getTime()) / (1000 * 60 * 60 * 24))} gun`
                              : 'Belirtilmemis'}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Course Equivalency */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                Ders Esdegerligi
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed mb-4">
                Bu dersin AKTS kredisi <span className="font-semibold text-slate-900">{course.ects}</span>&apos;dir.
                Kendi universitenizin mufredat koordinatorlugu ile bu dersin esdegerligini
                teyit ettirmeniz onemle oneriliyor.
              </p>
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-700">
                  Yaz okulundan alinan dersler, kayitli oldugunuz universitenizin senato karariyla esdeger kabul edilir.
                  Basvuru oncesi bolum baskanliginizla gorusmenizi oneririz.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar (1/3) - Sticky */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24 space-y-6">
              {/* Price Summary */}
              <div className="text-center pb-6 border-b border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Ders Ucreti</p>
                <p className="text-3xl font-bold text-slate-900">
                  {course.price
                    ? `${Number(course.price).toLocaleString('tr-TR')} ${course.currency || 'TL'}`
                    : 'Ucretsiz'}
                </p>
              </div>

              {/* Apply Button */}
              {course.applicationUrl ? (
                <a
                  href={course.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                >
                  <ExternalLink className="w-5 h-5" />
                  Resmi Basvuru Sayfasi
                </a>
              ) : (
                <div className="py-4 px-6 bg-slate-50 text-slate-500 text-center rounded-xl text-sm">
                  Basvuru linki henuz eklenmemis
                </div>
              )}

              {/* Favorilere Ekle */}
              <FavoriteButton courseId={course.id} variant="detail" />

              {/* Karşılaştırmaya Ekle */}
              <CompareButton courseId={course.id} />

              {/* Key Details */}
              <div className="space-y-4">
                {course.startDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Baslangic</p>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(course.startDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
                {course.endDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-500">Bitis</p>
                      <p className="text-sm font-medium text-slate-900">
                        {new Date(course.endDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">AKTS Kredisi</p>
                    <p className="text-sm font-medium text-slate-900">{course.ects} AKTS</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Egitim Formati</p>
                    <p className="text-sm font-medium text-slate-900">{course.isOnline ? 'Online (Uzaktan)' : 'Yuzyuze (Kampus)'}</p>
                  </div>
                </div>
              </div>

              {/* University Info */}
              {university && (
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-3">Sunan Universite</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{university.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {university.city}
                      </p>
                    </div>
                  </div>
                  {university.website && (
                    <a
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Universite Web Sitesi
                    </a>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}
