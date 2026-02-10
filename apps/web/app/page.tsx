/**
 * Ana Sayfa - 3D Türkiye haritası ve merkezi ders arama çubuğu.
 * Server Component: SEO dostu, hızlı ilk yükleme.
 */
import Link from 'next/link';
import { SearchBar } from '@/components/layout/search-bar';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-xl font-bold text-primary">
              Yaz Okulu Var mı?
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/search"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Ders Ara
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Giriş Yap
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        {/* 3D Harita placeholder - Three.js entegrasyonu daha sonra eklenecek */}
        <div className="absolute inset-0 pt-16 flex items-center justify-center opacity-10">
          <div className="w-[600px] h-[400px] rounded-full bg-gradient-to-br from-primary/30 to-blue-300/30 blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
            Türkiye&apos;deki Tüm{' '}
            <span className="text-primary">Yaz Okulu</span>{' '}
            Derslerini Keşfet
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Üniversitelerin yaz okulu derslerini tek platformda ara, karşılaştır
            ve en uygun dersi bul. AKTS, ücret ve konum filtresiyle hızlıca karar ver.
          </p>

          {/* Merkezi Arama Çubuğu */}
          <SearchBar />

          {/* Hızlı Filtreler */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <span className="text-sm text-muted-foreground">Popüler:</span>
            {['Matematik', 'Fizik', 'İngilizce', 'Programlama'].map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 mt-20 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto px-4 pb-12">
          {[
            { value: '100+', label: 'Üniversite' },
            { value: '5.000+', label: 'Ders' },
            { value: '81', label: 'Şehir' },
            { value: 'Anlık', label: 'Güncelleme' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Nasıl Çalışır?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Ders Ara',
                description: 'Ders adı, kod veya üniversite adıyla arama yapın. Şehir, AKTS ve ücret filtrelerini kullanın.',
                step: '1',
              },
              {
                title: 'Karşılaştır',
                description: 'Farklı üniversitelerin aynı dersi için ücret, AKTS ve eğitim formatını karşılaştırın.',
                step: '2',
              },
              {
                title: 'Başvur',
                description: 'En uygun dersi bulduğunuzda doğrudan üniversitenin başvuru sayfasına yönlenin.',
                step: '3',
              },
            ].map((feature) => (
              <div
                key={feature.step}
                className="relative p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-4">
                  {feature.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Yaz Okulu Var mı? - Tüm hakları saklıdır.</p>
          <p className="mt-2">
            Bu proje TÜBİTAK destekli akademik bir araştırma kapsamında geliştirilmektedir.
          </p>
        </div>
      </footer>
    </main>
  );
}
