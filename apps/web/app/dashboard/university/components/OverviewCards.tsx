/**
 * OverviewCards - Genel bakış kartları (ders, görüntülenme, favori, başvuru).
 */
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  Eye,
  Heart,
  MousePointerClick,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { universityApi } from '@/lib/api';

interface OverviewData {
  totalCourses: number;
  newCoursesLastMonth: number;
  totalViews: number;
  recentViews: number;
  viewsChangePercent: number;
  totalFavorites: number;
  recentFavorites: number;
  favoritesChangePercent: number;
  totalApplicationClicks: number;
  recentApplicationClicks: number;
  applicationsChangePercent: number;
}

export function OverviewCards() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    universityApi
      .getDashboardOverview()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return null;

  const cards = [
    {
      title: 'Toplam Ders',
      value: data.totalCourses,
      subtitle: `+${data.newCoursesLastMonth} bu ay`,
      icon: BookOpen,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Görüntülenme',
      value: data.totalViews.toLocaleString('tr-TR'),
      subtitle: `${data.recentViews} (son 30 gün)`,
      change: data.viewsChangePercent,
      icon: Eye,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Favoriye Eklenme',
      value: data.totalFavorites,
      subtitle: `${data.recentFavorites} (son 7 gün)`,
      change: data.favoritesChangePercent,
      icon: Heart,
      iconColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Başvuru Tıklama',
      value: data.totalApplicationClicks,
      subtitle: `${data.recentApplicationClicks} (son 7 gün)`,
      change: data.applicationsChangePercent,
      icon: MousePointerClick,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change !== undefined && card.change >= 0;
        const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {card.value}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-500">{card.subtitle}</p>
                {card.change !== undefined && (
                  <div
                    className={`flex items-center gap-1 ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <ChangeIcon className="h-3 w-3" />
                    <span className="text-xs font-medium">
                      {Math.abs(card.change)}%
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
