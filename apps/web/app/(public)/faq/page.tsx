/**
 * FAQ Sayfasi - Accordion tarzinda sikca sorulan sorular.
 * Kategorilere ayrilmis, arama destekli.
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Search, ChevronDown, Mail, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FaqItem[] = [
  {
    category: 'Genel',
    question: 'Yaz Okulu Var mi? nedir?',
    answer: 'Yaz Okulu Var mi?, Turkiye\'deki universitelerin yaz okulu ders bilgilerini tek bir platformda toplayan, ogrencilere akilli filtreleme ve karar destegi sunan merkezi bir arama platformudur. TUBITAK destekli akademik bir arastirma projesidir.',
  },
  {
    category: 'Genel',
    question: 'Platform ucretsiz mi?',
    answer: 'Evet, ogrenciler icin platform tamamen ucretsizdir. Ders arama, filtreleme ve karsilastirma ozellikleri herhangi bir kayit gerektirmeden kullanilabilir. Universiteler icin de temel ozellikler ucretsizdir.',
  },
  {
    category: 'Genel',
    question: 'Hangi universiteler platformda yer aliyor?',
    answer: 'Turkiye genelindeki devlet ve vakif universiteleri platformda yer alabilir. Universite yetkilileri .edu.tr uzantili kurumsal e-postalari ile kayit olabilir ve admin onayindan sonra ders bilgilerini girebilir.',
  },
  {
    category: 'Akademik / AKTS',
    question: 'AKTS nedir ve neden onemlidir?',
    answer: 'AKTS (Avrupa Kredi Transfer Sistemi), bir dersin ogrenci is yukunu gosteren standart bir olcu birimidir. Yaz okulunda alinan derslerin kendi universitenizdeki esdegerligini belirlemede AKTS kredisi temel kriter olarak kullanilir.',
  },
  {
    category: 'Akademik / AKTS',
    question: 'Baska universiteden alinan ders kendi universitemde gecerli olur mu?',
    answer: 'Bu, kayitli oldugunuz universitenin senato kararina baglidir. Cogu universite, AKTS kredisi esit veya fazla olan dersleri esdeger kabul eder. Basvuru oncesi bolum baskanliginiz ile gorusmenizi kesinlikle oneririz.',
  },
  {
    category: 'Akademik / AKTS',
    question: 'Online dersler yuzyuze derslerle ayni mi kabul ediliyor?',
    answer: 'Bu tamamen universitenize baglidir. Bazi universiteler online dersleri kabul ederken, bazilari sadece yuzyuze dersleri esdeger sayar. Kendi universitenizin yaz okulu yonergesini kontrol edin.',
  },
  {
    category: 'Odeme ve Basvuru',
    question: 'Derse nasil basvuruyorum?',
    answer: 'Platformumuz uzerinden istediginiz dersin detay sayfasina gidin. "Resmi Basvuru Sayfasi" butonuna tiklayarak dogrudan universitenin kendi basvuru sistemine yonlendirilirsiniz. Basvuru sureci ilgili universitenin kuralarina tabidir.',
  },
  {
    category: 'Odeme ve Basvuru',
    question: 'Ders ucretleri neye gore degisiyor?',
    answer: 'Ders ucretleri universiteye, AKTS kredisine ve egitim formatina (online/yuzyuze) gore degisir. Platformumuzda ucret filtresini kullanarak butcenize uygun dersleri kolayca bulabilirsiniz.',
  },
  {
    category: 'Odeme ve Basvuru',
    question: 'Burs imkani var mi?',
    answer: 'Bazi universiteler yaz okulu icin burs veya indirim imkani sunmaktadir. Bu bilgi ders detay sayfasinda belirtilir. Ayrica ilgili universitenin burs ofisi ile dogrudan iletisime gecebilirsiniz.',
  },
];

const categories = ['Tumu', 'Genel', 'Akademik / AKTS', 'Odeme ve Basvuru'];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tumu');
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'Tumu' || faq.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (index: number) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(index)) {
      newOpen.delete(index);
    } else {
      newOpen.add(index);
    }
    setOpenItems(newOpen);
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-[#0F172A]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/10 mb-6">
            <HelpCircle className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Sikca Sorulan Sorular
          </h1>
          <p className="text-slate-400 mb-8">
            Sana nasil yardimci olabiliriz?
          </p>

          {/* Search */}
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Soru ara..."
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/[0.07] text-white placeholder:text-slate-500 border border-white/10 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-500'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all hover:border-slate-300"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-500 shrink-0 mt-0.5">
                    {faq.category}
                  </span>
                  <h3 className="text-base font-medium text-slate-900 leading-relaxed">
                    {faq.question}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 shrink-0 ml-4 transition-transform duration-200 ${
                    openItems.has(index) ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openItems.has(index) && (
                <div className="px-6 pb-6 pt-0">
                  <div className="pl-[calc(0.5rem+2.5rem)] text-sm text-slate-500 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-500">Aramaniza uygun soru bulunamadi.</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 p-8 rounded-2xl bg-white border border-slate-200 text-center">
          <Mail className="w-8 h-8 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Sorunuz hala cevaplanmadi mi?
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Destek ekibimiz size yardimci olmaktan mutluluk duyar.
          </p>
          <a
            href="mailto:destek@yazokuluvarmi.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20"
          >
            <Mail className="w-4 h-4" />
            Destek ile Iletisime Gec
          </a>
        </div>
      </div>

      <Footer />
    </main>
  );
}
