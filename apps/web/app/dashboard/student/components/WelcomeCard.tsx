/**
 * WelcomeCard - Öğrenci dashboard hoş geldin ve istatistik kartı.
 */
'use client';

interface Profile {
  fullName: string | null;
  email: string;
}

interface Stats {
  totalSearches: number;
  totalFavorites: number;
  totalInteractions: number;
  lastSearchDate: string | null;
}

interface WelcomeCardProps {
  profile: Profile;
  stats: Stats;
}

function formatRelativeDate(dateStr: string | null): string {
  if (!dateStr) return 'Henüz yok';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'Az önce';
  if (diffMins < 60) return `${diffMins} dakika önce`;
  if (diffHours < 24) return `${diffHours} saat önce`;
  if (diffDays === 1) return 'Dün';
  if (diffDays < 7) return `${diffDays} gün önce`;
  return date.toLocaleDateString('tr-TR');
}

export function WelcomeCard({ profile, stats }: WelcomeCardProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 p-6 text-white shadow-lg">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-indigo-100 text-sm mb-1">Hoş geldin!</p>
          <h1 className="text-2xl font-bold">
            Merhaba, {profile.fullName || profile.email.split('@')[0]}!
          </h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatItem label="Toplam Arama" value={stats.totalSearches} />
          <StatItem label="Favori Ders" value={stats.totalFavorites} />
          <StatItem label="İncelenen Ders" value={stats.totalInteractions} />
          <div className="col-span-2 sm:col-span-1">
            <p className="text-indigo-100 text-xs">Son Arama</p>
            <p className="font-medium text-sm">
              {formatRelativeDate(stats.lastSearchDate)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-indigo-100 text-xs">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
