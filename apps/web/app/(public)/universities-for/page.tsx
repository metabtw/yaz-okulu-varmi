/**
 * Universiteler Icin - B2B landing page.
 * Universite yoneticilerine yonelik partner sayfasi.
 */
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  ArrowRight, BarChart3, Eye, Zap, Shield,
  CheckCircle2, Monitor, TrendingUp, Users
} from 'lucide-react';

export default function UniversitiesForPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 map-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/[0.05] blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-slate-300 text-sm mb-8">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Universiteler Icin Ozel</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Universitenizin Yaz Okulu Verilerini{' '}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Tek Bir Panelden
            </span>{' '}
            Yonetin
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Ders bilgilerinizi platformumuza ekleyin, binlerce ogrenciye ulasin.
            Detayli analitik raporlarla arama trendlerini takip edin.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-base"
            >
              Partner Olun
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-8 py-4 text-slate-300 hover:text-white font-medium rounded-2xl border border-white/10 hover:border-white/20 transition-all text-base"
            >
              Nasil Calisir?
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">Avantajlar</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Neden Yaz Okulu Var mi?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Sifir Veri Girisi</h3>
              <p className="text-slate-500 leading-relaxed">
                Widget entegrasyonumuz ile ders bilgileriniz otomatik olarak guncellenir.
                Manuel veri girisi zahmetinden kurtulun.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Artan Gorunurluk</h3>
              <p className="text-slate-500 leading-relaxed">
                Binlerce ogrencinin aradigi merkezi platformda yer alin.
                Yaz okulu programinizi Turkiye geneline duyurun.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Detayli Analitik</h3>
              <p className="text-slate-500 leading-relaxed">
                Hangi dersler en cok araniyor? Hangi sehirlerden talep geliyor?
                Arama trendlerini detayli raporlarla takip edin.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">Universite Paneli</p>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-6">
                Guclu Yonetim Paneli
              </h2>
              <p className="text-lg text-slate-500 leading-relaxed mb-8">
                Ders ekleme, duzenleme ve silme islemlerini kolay arayuzumuzle yapin.
                Ogrenci ilgisini ve basvuru oranlarini anlik takip edin.
              </p>
              <ul className="space-y-4">
                {[
                  'Toplu ders ekleme ve CSV import',
                  'Anlik basvuru istatistikleri',
                  'Widget yonetimi ve renk ozellestirme',
                  'Coklu kullanici desteği (yetkilendirme)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-600">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 h-6 bg-slate-200 rounded-lg max-w-xs" />
                </div>
                <div className="p-6 space-y-4">
                  {/* Stats row mockup */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { icon: Monitor, label: 'Dersler', value: '24', color: 'blue' },
                      { icon: Users, label: 'Goruntulenme', value: '1.2K', color: 'emerald' },
                      { icon: TrendingUp, label: 'Trend', value: '+15%', color: 'violet' },
                    ].map((s) => (
                      <div key={s.label} className="p-4 rounded-xl bg-slate-50">
                        <s.icon className={`w-5 h-5 mb-2 ${
                          s.color === 'blue' ? 'text-blue-500' :
                          s.color === 'emerald' ? 'text-emerald-500' :
                          'text-violet-500'
                        }`} />
                        <p className="text-xl font-bold text-slate-900">{s.value}</p>
                        <p className="text-xs text-slate-500">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Table mockup */}
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                        <div className="w-8 h-8 rounded-lg bg-blue-100" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-slate-200 rounded w-1/2" />
                          <div className="h-2 bg-slate-100 rounded w-1/3" />
                        </div>
                        <div className="h-6 w-16 bg-blue-100 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0F172A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-6">
            Hemen Partner Olun
          </h2>
          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            .edu.tr uzantili kurumsal e-posta adresinizle kayit olun.
            Admin ekibimiz basvurunuzu hizla onaylayacaktir.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-lg"
          >
            .edu.tr ile Kayit Ol
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
