/**
 * Footer - Modern dark footer with TUBITAK branding and multi-column layout.
 */
import Link from 'next/link';
import { MapPin, Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#020617] text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Yaz Okulu Var mı?
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 mb-6">
              Türkiye&apos;deki üniversitelerin yaz okulu derslerini tek platformda
              toplayan, öğrencilere akıllı filtreleme ve karar desteği sunan
              merkezi arama platformu.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/metabtw/yaz-okulu-varmi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@yazokuluvarmi.com"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Students Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Öğrenciler
            </h4>
            <ul className="space-y-3">
              <li><Link href="/search" className="text-sm hover:text-white transition-colors">Ders Ara</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-white transition-colors">Sıkça Sorulan Sorular</Link></li>
              <li><Link href="/faq" className="text-sm hover:text-white transition-colors">Öğrenci Rehberi</Link></li>
              <li><Link href="/faq#akts" className="text-sm hover:text-white transition-colors">AKTS Nedir?</Link></li>
            </ul>
          </div>

          {/* Universities Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Üniversiteler
            </h4>
            <ul className="space-y-3">
              <li><Link href="/universities-for" className="text-sm hover:text-white transition-colors">Partner Panel</Link></li>
              <li><Link href="/register" className="text-sm hover:text-white transition-colors">Üniversite Kaydı</Link></li>
              <li><Link href="/universities-for" className="text-sm hover:text-white transition-colors">Entegrasyon Rehberi</Link></li>
              <li><Link href="/universities-for" className="text-sm hover:text-white transition-colors">Widget Dokümantasyonu</Link></li>
            </ul>
          </div>

          {/* TUBITAK Column */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Proje
            </h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Hakkında</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Ekip</Link></li>
              <li>
                <a href="https://github.com/metabtw/yaz-okulu-varmi" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors">
                  Açık Kaynak (GitHub)
                </a>
              </li>
            </ul>

            {/* TUBITAK Badge */}
            <div className="mt-6 p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
              <p className="text-xs font-semibold text-slate-300 mb-1">TÜBİTAK Destekli</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bu proje TÜBİTAK akademik araştırma kapsamında geliştirilmektedir.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Yaz Okulu Var mı? - Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/about" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
