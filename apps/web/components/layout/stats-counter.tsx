/**
 * StatsCounter - Animasyonlu istatistik sayac komponenti.
 * Sayfa gorunur oldugunda sayilar yukaridan kayarak belirir.
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import { GraduationCap, Building2, Search, BookOpen } from 'lucide-react';

const stats = [
  { icon: Building2, value: '80+', label: 'Üniversite', color: 'text-blue-500' },
  { icon: BookOpen, value: '5.000+', label: 'Aktif Ders', color: 'text-emerald-500' },
  { icon: Search, value: '10.000+', label: 'Öğrenci Araması', color: 'text-violet-500' },
  { icon: GraduationCap, value: '81', label: 'Şehir', color: 'text-amber-500' },
];

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center transition-all duration-700 ${
                visible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 mb-4 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
