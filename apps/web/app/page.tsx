/**
 * Ana Sayfa - Futuristic SaaS landing page.
 * 3D harita arka plan, glassmorphism arama, istatistikler, nasıl çalışır, footer.
 */
import Link from 'next/link';
import { SearchBar } from '@/components/layout/search-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { StatsCounter } from '@/components/layout/stats-counter';
import { Sparkles, ArrowRight, Search, GitCompare, ExternalLink } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col font-display bg-[#f9f8fc] text-[#100d1c]">
      <Header />

      {/* Hero Section */}
      <section className="w-full py-16 lg:py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
          {/* Left: Content & Search */}
          <div className="flex flex-col gap-8 max-w-xl">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 w-fit">
                <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-primary text-xs font-bold uppercase tracking-wider">2024 Başvuruları Başladı</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-[#100d1c]">
                Hayalindeki <span className="text-primary">Yaz Okulunu</span> Keşfet
              </h1>
              <p className="text-lg text-[#100d1c]/70 leading-relaxed max-w-lg">
                Türkiye&apos;nin en iyi üniversitelerindeki programları karşılaştır, sana en uygun olanı hemen bul ve kariyerine yön ver.
              </p>
            </div>

            {/* Search Bar - Custom Implementation matching design */}
            <div className="bg-white p-2 rounded-xl border border-[#e9e7f4] shadow-xl shadow-primary/5">
              <SearchBar variant="hero" />
            </div>

            <div className="flex items-center gap-4 text-sm text-[#100d1c]/60">
              <span className="font-medium">Popüler:</span>
              <div className="flex gap-2 flex-wrap">
                <Link href="/search?q=Yazılım" className="hover:text-primary underline decoration-primary/30 underline-offset-4">Yazılım Mühendisliği</Link>
                <span className="text-gray-300">•</span>
                <Link href="/search?q=Hukuk" className="hover:text-primary underline decoration-primary/30 underline-offset-4">Hukuk</Link>
                <span className="text-gray-300">•</span>
                <Link href="/search?q=Psikoloji" className="hover:text-primary underline decoration-primary/30 underline-offset-4">Psikoloji</Link>
              </div>
            </div>
          </div>

          {/* Right: Image Collage - Üniversite Görselleri */}
          <div className="relative grid grid-cols-2 gap-4 h-full min-h-[400px]">
            <div className="flex flex-col gap-4 mt-12">
              <div className="w-full h-48 rounded-2xl bg-gray-200 overflow-hidden shadow-lg transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 relative group">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                {/* Öğrenciler çalışıyor */}
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop&q=80" 
                  alt="Öğrenciler birlikte çalışıyor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full h-64 rounded-2xl bg-gray-200 overflow-hidden shadow-lg transform rotate-[1deg] hover:rotate-0 transition-transform duration-500 relative group">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                {/* Öğrenci kitap okuyor */}
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80" 
                  alt="Öğrenci kitap okuyor"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="w-full h-64 rounded-2xl bg-gray-200 overflow-hidden shadow-lg transform rotate-[2deg] hover:rotate-0 transition-transform duration-500 relative group">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                {/* Üniversite kampüsü */}
                <img 
                  src="https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=400&fit=crop&q=80" 
                  alt="Üniversite kampüsü"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-full h-48 rounded-2xl bg-gray-200 overflow-hidden shadow-lg transform rotate-[-1deg] hover:rotate-0 transition-transform duration-500 relative group">
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
                {/* Mezuniyet */}
                <img 
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop&q=80" 
                  alt="Mezuniyet töreni"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl opacity-50"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 px-6 bg-white">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#100d1c] mb-4">Neden Yaz Okulu Platformu?</h2>
            <p className="text-[#100d1c]/60 max-w-2xl mx-auto">Binlerce öğrenci ve yüzlerce üniversiteyi tek bir çatı altında buluşturan özelliklerimiz.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-white border border-[#e9e7f4] hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#100d1c] mb-3">Kolay Arama</h3>
              <p className="text-[#100d1c]/60 leading-relaxed">Binlerce program arasından detaylı filtreleme yaparak sana en uygun olanı saniyeler içinde bul.</p>
            </div>
            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-white border border-[#e9e7f4] hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                <GitCompare className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#100d1c] mb-3">Kurs Karşılaştırma</h3>
              <p className="text-[#100d1c]/60 leading-relaxed">Farklı üniversitelerin programlarını fiyat, içerik ve tarihler açısından yan yana koy ve kıyasla.</p>
            </div>
            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-white border border-[#e9e7f4] hover:border-primary hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                {/* Bell icon replacement */}
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#100d1c] mb-3">Üniversite Takibi</h3>
              <p className="text-[#100d1c]/60 leading-relaxed">İlgilendiğin üniversiteleri favorilerine ekle, yeni açılan kontenjanlardan ve duyurulardan ilk sen haberdar ol.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="w-full bg-primary py-16 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center relative z-10">
          <div className="flex flex-col gap-2 p-4">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">50+</span>
            <span className="text-white/80 font-medium text-sm uppercase tracking-wider">Anlaşmalı Üniversite</span>
          </div>
          <div className="flex flex-col gap-2 p-4 border-l border-white/10">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">2000+</span>
            <span className="text-white/80 font-medium text-sm uppercase tracking-wider">Mutlu Öğrenci</span>
          </div>
          <div className="flex flex-col gap-2 p-4 border-l border-white/10">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">500+</span>
            <span className="text-white/80 font-medium text-sm uppercase tracking-wider">Aktif Program</span>
          </div>
          <div className="flex flex-col gap-2 p-4 border-l border-white/10">
            <span className="text-4xl md:text-5xl font-black text-white tracking-tight">12+</span>
            <span className="text-white/80 font-medium text-sm uppercase tracking-wider">Şehir</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-[1000px] mx-auto bg-[#f9f8fc] rounded-3xl p-8 md:p-12 text-center border border-[#e9e7f4] flex flex-col items-center gap-6 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-[#100d1c]">Hemen Başlamaya Hazır mısın?</h2>
          <p className="text-[#100d1c]/70 max-w-lg text-lg">Geleceğini şekillendirecek yaz okulu programını bulmak için daha fazla bekleme.</p>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Link href="/register" className="flex items-center justify-center h-12 px-8 rounded-lg bg-primary text-white font-bold text-base hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Ücretsiz Kayıt Ol
            </Link>
            <Link href="/about" className="flex items-center justify-center h-12 px-8 rounded-lg bg-white border border-[#d3cee8] text-[#100d1c] font-bold text-base hover:bg-[#f6f5f8] transition-colors">
              Daha Fazla Bilgi
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
