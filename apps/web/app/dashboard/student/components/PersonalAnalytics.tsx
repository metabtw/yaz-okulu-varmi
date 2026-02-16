/**
 * PersonalAnalytics - Tercih analitikleri (şehir, AKTS dağılımı).
 */
'use client';

interface Stats {
  topSearchedCity: string | null;
  avgEctsInterest: number;
  totalSearches: number;
}

interface PersonalAnalyticsProps {
  stats: Stats;
}

export function PersonalAnalytics({ stats }: PersonalAnalyticsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Tercih Analitiklerim
      </h2>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="p-4 rounded-xl bg-slate-50">
          <p className="text-sm font-medium text-slate-500 mb-1">
            En Çok Aradığım Şehir
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.topSearchedCity || 'Veri yok'}
          </p>
        </div>
        <div className="p-4 rounded-xl bg-slate-50">
          <p className="text-sm font-medium text-slate-500 mb-1">
            Ortalama İlgilendiğim AKTS
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {stats.avgEctsInterest > 0 ? `${stats.avgEctsInterest} AKTS` : 'Veri yok'}
          </p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-4">
        Bu veriler sadece size özeldir ve başkalarıyla paylaşılmaz.
      </p>
    </div>
  );
}
