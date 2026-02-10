/**
 * Ana Sayfa - Futuristic SaaS landing page.
 * 3D harita arka plan, glassmorphism arama, istatistikler, nasil calisir, footer.
 */
import Link from 'next/link';
import { SearchBar } from '@/components/layout/search-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StatsCounter } from '@/components/layout/stats-counter';
import { Sparkles, ArrowRight, Search, GitCompare, ExternalLink } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* ======== HERO SECTION ======== */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0F172A]">
        {/* Background: Turkey map styled grid + glow effects */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <div className="absolute inset-0 map-grid opacity-40" />

          {/* Large orb glows to simulate Turkey map */}
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[300px] rounded-full bg-blue-500/[0.04] blur-[100px]" />
          <div className="absolute top-1/4 right-1/3 w-[400px] h-[250px] rounded-full bg-teal-500/[0.03] blur-[80px]" />
          <div className="absolute bottom-1/3 left-1/2 w-[600px] h-[350px] rounded-full bg-blue-400/[0.03] blur-[120px] -translate-x-1/2" />

          {/* Glowing city dots */}
          <div className="absolute top-[30%] left-[25%] w-2 h-2 rounded-full bg-blue-400 animate-pulse-dot opacity-60" />
          <div className="absolute top-[35%] left-[40%] w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse-dot opacity-50" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[28%] right-[30%] w-2 h-2 rounded-full bg-blue-300 animate-pulse-dot opacity-40" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[55%] w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse-dot opacity-50" style={{ animationDelay: '0.5s' }} />
          <div className="absolute top-[32%] right-[20%] w-2 h-2 rounded-full bg-blue-400 animate-pulse-dot opacity-30" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-[35%] left-[35%] w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse-dot opacity-40" style={{ animationDelay: '2.5s' }} />

          {/* Connecting lines (subtle SVG) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <line x1="25%" y1="30%" x2="40%" y2="35%" stroke="currentColor" strokeWidth="1" className="text-blue-400" />
            <line x1="40%" y1="35%" x2="55%" y2="40%" stroke="currentColor" strokeWidth="1" className="text-blue-400" />
            <line x1="55%" y1="40%" x2="70%" y2="28%" stroke="currentColor" strokeWidth="1" className="text-teal-400" />
            <line x1="25%" y1="30%" x2="35%" y2="65%" stroke="currentColor" strokeWidth="1" className="text-blue-300" />
          </svg>
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-24 pb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-slate-300 text-sm mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>TUBITAK Destekli Akademik Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Turkiye&apos;nin Tum{' '}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Yaz Okullari
            </span>
            ,{' '}
            <br className="hidden sm:block" />
            Tek Haritada.
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Universitelerin yaz okulu derslerini ara, karsilastir ve en uygun dersi bul.
            AKTS, ucret ve konum filtresiyle saniyeler icinde karar ver.
          </p>

          {/* Glassmorphism Search */}
          <SearchBar variant="hero" />

          {/* Popular tags */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-slate-500">Populer:</span>
            {['Matematik', 'Fizik', 'Ingilizce', 'Programlama', 'Lineer Cebir'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="px-3.5 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Fade out gradient at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ======== STATS STRIP ======== */}
      <StatsCounter />

      {/* ======== HOW IT WORKS ======== */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">Nasil Calisir?</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Uc Adimda Hayalindeki Derse Ulas
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Search,
                title: 'Ders Ara',
                description: 'Ders adi, kodu veya universite adiyla arama yap. Sehir, AKTS, ucret ve egitim formati filtrelerini kullan.',
                step: '01',
                color: 'blue',
              },
              {
                icon: GitCompare,
                title: 'Karsilastir',
                description: 'Farkli universitelerin ayni dersi icin ucret, AKTS ve egitim formatini yan yana karsilastir.',
                step: '02',
                color: 'teal',
              },
              {
                icon: ExternalLink,
                title: 'Basvur',
                description: 'En uygun dersi buldugunda dogrudan universitenin basvuru sayfasina tek tikla yonlen.',
                step: '03',
                color: 'violet',
              },
            ].map((feature) => (
              <div
                key={feature.step}
                className="group relative p-8 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    feature.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                    feature.color === 'teal' ? 'bg-teal-50 text-teal-500' :
                    'bg-violet-50 text-violet-500'
                  }`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-bold text-slate-100 group-hover:text-blue-50 transition-colors">
                    {feature.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======== CTA SECTION ======== */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
            Universite Yetkilisi misiniz?
          </h2>
          <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            Yaz okulu ders bilgilerinizi platformumuza ekleyin, binlerce ogrenciye ulasin.
            Widget entegrasyonu ile kendi sitenizde de ders tablosu yayinlayin.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-blue-500 hover:bg-blue-400 rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
            >
              Ucretsiz Kayit Ol
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/universities-for"
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
            >
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </section>

      {/* ======== FOOTER ======== */}
      <Footer />
    </main>
  );
}
