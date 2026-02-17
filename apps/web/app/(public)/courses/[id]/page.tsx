
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { TrackCourseView } from '@/components/course/TrackCourseView';
import { FavoriteButton } from '@/components/course/FavoriteButton';
import { CompareButton } from '@/components/course/CompareButton';
import {
  ChevronRight, Star, School, Lightbulb, CheckCircle2, Play, Calendar,
  Clock, Globe, MapPin, ArrowRight, Verified, Linkedin, Twitter, ExternalLink,
  GraduationCap
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
      <main className="min-h-screen flex items-center justify-center bg-[#f9f8fc]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Ders Bulunamadı</h1>
          <Link href="/search" className="text-primary hover:underline">Aramaya Dön</Link>
        </div>
      </main>
    )
  }

  const university = course.university;

  // Static Instructor Data (Placeholder as requested by design)
  const instructor = {
    name: "Prof. Dr. Ayşe Yılmaz",
    title: "Bilgisayar Mühendisliği Bölüm Başkanı",
    bio: "Yapay zeka ve makine öğrenmesi alanında 15 yılı aşkın akademik ve endüstriyel deneyime sahiptir."
  };

  return (
    <div className="bg-[#f9f8fc] dark:bg-[#131022] text-slate-900 dark:text-slate-50 min-h-screen flex flex-col font-sans antialiased">
      <Header />
      <TrackCourseView courseId={course.id} />

      {/* Main Layout */}
      <main className="flex-1 pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/search" className="hover:text-primary transition-colors">Yaz Okulları</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#100d1c] dark:text-white font-medium truncate max-w-[200px]">{course.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Main Column (Left) */}
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {course.code || 'POPULER KURS'}
                </div>
                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-white leading-tight">
                  {course.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {university?.logo ? (
                      <img src={university.logo} alt={university.name} className="h-full w-full object-cover" />
                    ) : (
                      <School className="text-slate-400 w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{university?.name || 'Üniversite'}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="flex items-center text-amber-500 mr-1">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current opacity-50" />
                      </span>
                      <span>(4.8/5.0 - 120 Değerlendirme)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs/Navigation for Content */}
              <div className="w-full border-b border-gray-200">
                <div className="flex h-12 items-center justify-start gap-8">
                  <button className="inline-flex items-center justify-center whitespace-nowrap border-b-2 border-primary py-2 text-sm font-medium text-primary">
                    Genel Bakış
                  </button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Müfredat
                  </button>
                  <button className="inline-flex items-center justify-center whitespace-nowrap border-b-2 border-transparent py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Değerlendirmeler
                  </button>
                </div>
              </div>

              {/* Course Description */}
              <section className="space-y-4">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Kurs Hakkında
                </h3>
                <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
                  <p>
                    {course.description || "Bu kurs için henüz detaylı bir açıklama girilmemiştir."}
                  </p>
                </div>
              </section>

              {/* Learning Outcomes */}
              <section className="rounded-xl border border-gray-200 bg-white dark:bg-slate-800 p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-semibold tracking-tight mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                  <Lightbulb className="text-primary w-6 h-6" />
                  Öğrenim Kazanımları
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">Dersin temel kavramlarını derinlemesine anlama.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">Pratik uygulamalar ve proje tabanlı çalışmalar.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">Akademik ve sektörel yetkinlik kazanımı.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 w-5 h-5 mt-0.5 shrink-0" />
                    <span className="text-slate-600 dark:text-slate-300">{course.ects} AKTS kredisi ile uluslararası geçerlilik.</span>
                  </li>
                </ul>
              </section>

              {/* Instructor Info - Static Placeholder */}
              <section className="space-y-6">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  Eğitmen Bilgisi
                </h3>
                <div className="flex flex-col sm:flex-row gap-6 items-start bg-white dark:bg-slate-800 border border-gray-200 rounded-xl p-6">
                  <div className="relative shrink-0">
                    <div className="h-24 w-24 rounded-full bg-slate-200 flex items-center justify-center">
                      <School className="w-10 h-10 text-slate-400" />
                    </div>
                    <div className="absolute bottom-0 right-0 h-6 w-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                      <Verified className="text-white w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">{university?.name} Akademik Kadrosu</h4>
                      <p className="text-sm text-primary font-medium">Uzman Öğretim Üyeleri</p>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Bu ders, {university?.name} bünyesindeki alanında uzman akademisyenler tarafından verilmektedir.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Sticky Sidebar (Right) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                {/* Summary Card */}
                <div className="rounded-xl border border-gray-200 bg-white dark:bg-slate-800 shadow-sm overflow-hidden">
                  {/* Video/Image Preview Area */}
                  <div className="relative h-48 w-full bg-slate-100 group cursor-pointer overflow-hidden">
                    {/* Placeholder gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors">
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-gray-500">Dönem Ücreti</span>
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {course.price ? `${Number(course.price).toLocaleString('tr-TR')} ${course.currency || 'TL'}` : 'Ücretsiz'}
                      </span>
                    </div>
                    {/* <div className="text-sm text-slate-500 text-right mt-[-1rem]">Tahmini Eğitim Ücreti: ₺4.500</div> */}
                    <hr className="border-gray-200" />

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <div className="flex items-start gap-3">
                        <Calendar className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Süre</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">4 Hafta</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <GraduationCap className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Kredi</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{course.ects} ECTS</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Globe className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Dil</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Türkçe/İngilizce</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="text-gray-400 w-5 h-5" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">Format</p>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">{course.isOnline ? 'Online' : 'Yüzyüze'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {course.applicationUrl ? (
                        <a href={course.applicationUrl} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 h-11 px-8 shadow-md shadow-primary/20 transition-all">
                          Hemen Başvur
                        </a>
                      ) : (
                        <button disabled className="w-full inline-flex items-center justify-center rounded-lg text-sm font-bold bg-slate-100 text-slate-400 h-11 cursor-not-allowed">
                          Başvuru Kapalı
                        </button>
                      )}

                      <CompareButton courseId={course.id} className="w-full" />
                    </div>

                    <div className="flex items-center justify-center">
                      <FavoriteButton courseId={course.id} variant="detail" />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 justify-center text-xs text-gray-500">
                      <Verified className="w-4 h-4 text-green-600" />
                      <span>Resmi Üniversite Onaylı Ders</span>
                    </div>
                  </div>
                </div>

                {/* Need Help Card */}
                <div className="rounded-xl border border-gray-200 bg-white dark:bg-slate-800 p-6 shadow-sm">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Sorularınız mı var?</h4>
                  <p className="text-sm text-gray-500 mb-4">Program hakkında detaylı bilgi almak için bizimle iletişime geçebilirsiniz.</p>
                  <a href="#" className="text-primary text-sm font-medium hover:underline flex items-center">
                    İletişime Geç <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

