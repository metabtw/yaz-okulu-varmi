/**
 * Hakkında Sayfası - Proje misyonu, vizyonu ve TÜBİTAK desteği.
 * Platform hakkında detaylı bilgi sunar.
 */
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import {
  MapPin,
  Target,
  Heart,
  GraduationCap,
  Users,
  BookOpen,
  Shield,
  ArrowRight,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-24 bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 map-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-blue-500/[0.05] blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light text-slate-300 text-sm mb-8">
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>TÜBİTAK Destekli Akademik Proje</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6 leading-[1.1]">
            Türkiye&apos;nin Yaz Okulları{' '}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Tek Haritada
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Yaz Okulu Var mı?, öğrencilerin yaz döneminde açılan dersleri kolayca bulmasını,
            üniversitelerin ise programlarını merkezi bir platformda sunmasını sağlayan
            akademik bir araştırma projesidir.
          </p>

          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-2xl transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-base"
          >
            Ders Ara
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Misyon & Vizyon */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Target className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Misyonumuz</h2>
              <p className="text-slate-600 leading-relaxed">
                Türkiye genelindeki üniversitelerin yaz okulu ders bilgilerini tek bir platformda
                toplayarak öğrencilere şeffaf, hızlı ve güvenilir bir arama deneyimi sunmak.
                AKTS, fiyat ve konum filtreleri ile doğru kararı vermelerine yardımcı olmak.
              </p>
            </div>

            <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center mb-6">
                <MapPin className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Vizyonumuz</h2>
              <p className="text-slate-600 leading-relaxed">
                Türkiye&apos;deki tüm üniversitelerin yaz okulu programlarının merkezi bir haritada
                görüntülenebildiği, öğrenci-üniversite eşleştirmesinin kolaylaştığı ve akademik
                veri paylaşımının standartlaştığı bir ekosistem oluşturmak.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Değerler */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-blue-500 uppercase tracking-wider mb-3">
              Değerlerimiz
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Neye İnanıyoruz?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <Shield className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Güvenilirlik</h3>
              <p className="text-sm text-slate-500">
                Sadece doğrulanmış üniversite verileri. .edu.tr e-posta ile kayıt.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <GraduationCap className="w-10 h-10 text-teal-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Akademik Kalite</h3>
              <p className="text-sm text-slate-500">
                AKTS standartları, ders eşdeğerliği ve resmi başvuru süreçleri.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <Users className="w-10 h-10 text-violet-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Erişilebilirlik</h3>
              <p className="text-sm text-slate-500">
                Öğrenciler için ücretsiz. Tüm üniversiteler için açık platform.
              </p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <Heart className="w-10 h-10 text-rose-500 mb-4" />
              <h3 className="font-semibold text-slate-900 mb-2">Şeffaflık</h3>
              <p className="text-sm text-slate-500">
                Fiyat, tarih ve kontenjan bilgileri net ve güncel tutulur.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TÜBİTAK */}
      <section className="py-24 bg-[#0F172A]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-slate-300 text-sm mb-8">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Desteklenen Proje</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            TÜBİTAK Desteği
          </h2>
          <p className="text-slate-400 leading-relaxed mb-8">
            Yaz Okulu Var mı? platformu, TÜBİTAK tarafından desteklenen akademik bir araştırma
            projesidir. Proje, üniversite yaz okulu programlarının merkezi bir veritabanında
            toplanması ve öğrencilere akıllı arama imkânı sunulması hedefiyle geliştirilmiştir.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/universities-for"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl transition-all"
            >
              Üniversiteler İçin
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 px-6 py-3 text-slate-300 hover:text-white font-medium border border-white/20 hover:border-white/40 rounded-xl transition-all"
            >
              Sıkça Sorulan Sorular
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
