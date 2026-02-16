/**
 * CompareModal - Ders karşılaştırma modal bileşeni.
 * Analiz kartları, karşılaştırma tablosu ve PDF export.
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useCompare } from '@/contexts/compare-context';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ExternalLink,
  Trash2,
  TrendingDown,
  TrendingUp,
  Award,
  X,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { courseApi } from '@/lib/api';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Course {
  id: string;
  name: string;
  code: string;
  ects: number;
  price: number | string | null;
  currency: string;
  isOnline: boolean;
  quota: number | null;
  startDate: string | null;
  endDate: string | null;
  applicationUrl: string | null;
  university: {
    name: string;
    city: string;
    logo: string | null;
  };
}

interface CompareData {
  courses: Course[];
  analysis: {
    cheapest: Course;
    mostExpensive: Course;
    mostEcts: Course;
    leastEcts: Course;
    onlineCount: number;
    onsiteCount: number;
    stats: {
      avgPrice: number;
      minPrice: number;
      maxPrice: number;
      avgEcts: number;
      minEcts: number;
      maxEcts: number;
      totalCourses: number;
    };
    cities: string[];
    cityCount: number;
    universities: string[];
    universityCount: number;
  };
  comparedAt: string;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-96 rounded-lg" />
    </div>
  );
}

function AnalysisCards({
  analysis,
}: {
  analysis: CompareData['analysis'];
}) {
  const cards = [
    {
      title: 'Ortalama Ücret',
      value: `${Math.round(analysis.stats.avgPrice)} ₺`,
      icon: TrendingDown,
      color: 'text-blue-600',
    },
    {
      title: 'En Ucuz',
      value: `${analysis.cheapest.price ?? 0} ₺`,
      subtitle: analysis.cheapest.university.name,
      icon: TrendingDown,
      color: 'text-green-600',
    },
    {
      title: 'Ortalama AKTS',
      value: analysis.stats.avgEcts.toFixed(1),
      icon: Award,
      color: 'text-purple-600',
    },
    {
      title: 'Online/Yüz Yüze',
      value: `${analysis.onlineCount}/${analysis.onsiteCount}`,
      subtitle: `${Math.round((analysis.onlineCount / analysis.stats.totalCourses) * 100)}% online`,
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className="p-4 border rounded-lg bg-gradient-to-br from-slate-50 to-slate-100/50"
          >
            <div className="flex items-start justify-between mb-2">
              <p className="text-xs text-slate-500 font-medium">{card.title}</p>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            {card.subtitle && (
              <p className="text-xs text-slate-500 mt-1 truncate">
                {card.subtitle}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ComparisonTable({
  courses,
  analysis,
  onRemove,
}: {
  courses: Course[];
  analysis: CompareData['analysis'];
  onRemove: (id: string) => void;
}) {
  const rows: Array<{
    label: string;
    render: (c: Course) => React.ReactNode;
    highlight?: (c: Course) => boolean;
    highlightLabel?: string;
  }> = [
    {
      label: 'Üniversite',
      render: (c) => (
        <div className="flex items-center gap-2">
          {c.university.logo && (
            <img
              src={c.university.logo}
              alt={c.university.name}
              className="w-8 h-8 rounded object-cover"
            />
          )}
          <span className="font-medium">{c.university.name}</span>
        </div>
      ),
    },
    {
      label: 'Ders Kodu',
      render: (c) => <Badge variant="secondary">{c.code}</Badge>,
    },
    {
      label: 'Şehir',
      render: (c) => c.university.city,
    },
    {
      label: 'AKTS',
      render: (c) => c.ects,
      highlight: (c) => c.id === analysis.mostEcts.id,
      highlightLabel: 'En Yüksek',
    },
    {
      label: 'Ücret',
      render: (c) => `${c.price ?? 0} ${c.currency}`,
      highlight: (c) => c.id === analysis.cheapest.id,
      highlightLabel: 'En Ucuz',
    },
    {
      label: 'Ders Türü',
      render: (c) => (
        <Badge variant={c.isOnline ? 'default' : 'outline'}>
          {c.isOnline ? '🌐 Online' : '🏫 Yüz Yüze'}
        </Badge>
      ),
    },
    {
      label: 'Kontenjan',
      render: (c) => c.quota ?? 'Belirtilmemiş',
    },
    {
      label: 'Başlangıç',
      render: (c) =>
        c.startDate ? new Date(c.startDate).toLocaleDateString('tr-TR') : '-',
    },
    {
      label: 'Bitiş',
      render: (c) =>
        c.endDate ? new Date(c.endDate).toLocaleDateString('tr-TR') : '-',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-200">
            <th className="text-left p-4 font-semibold bg-slate-50">
              Özellik
            </th>
            {courses.map((course) => (
              <th
                key={course.id}
                className="text-left p-4 min-w-[250px] bg-slate-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-tight line-clamp-2">
                      {course.name}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => onRemove(course.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100 hover:bg-slate-50/50">
              <td className="p-4 font-medium text-sm text-slate-600">
                {row.label}
              </td>
              {courses.map((course) => {
                const isHighlighted = row.highlight?.(course);
                return (
                  <td
                    key={course.id}
                    className={`p-4 ${
                      isHighlighted ? 'bg-emerald-50' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      {row.render(course)}
                      {isHighlighted && row.highlightLabel && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 bg-emerald-100 text-emerald-800 border-emerald-200"
                        >
                          ✨ {row.highlightLabel}
                        </Badge>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
          <tr className="bg-slate-50">
            <td className="p-4 font-semibold text-slate-700">Başvuru</td>
            {courses.map((course) => (
              <td key={course.id} className="p-4">
                {course.applicationUrl ? (
                  <a
                    href={course.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Başvur
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">Link yok</span>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function CompareModal({ isOpen, onClose }: CompareModalProps) {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [data, setData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompareData = useCallback(async () => {
    if (compareList.length < 2) return;
    setLoading(true);
    setError(null);
    try {
      const json = await courseApi.compare(compareList);
      setData(json as CompareData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Karşılaştırma verisi alınamadı';
      setError(msg);
      toast.error('Karşılaştırma yapılırken hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [compareList]);

  useEffect(() => {
    if (isOpen && compareList.length >= 2) {
      fetchCompareData();
    } else if (isOpen && compareList.length < 2) {
      setData(null);
    }
  }, [isOpen, compareList, fetchCompareData]);

  const handleRemove = (courseId: string) => {
    removeFromCompare(courseId);
    toast.success('Ders karşılaştırmadan çıkarıldı');
  };

  const handleClearAll = () => {
    clearCompare();
    toast.success('Tüm dersler temizlendi');
    onClose();
  };

  const exportToPDF = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <DialogTitle className="text-2xl">Ders Karşılaştırma</DialogTitle>
              <DialogDescription>
                {compareList.length} ders karşılaştırılıyor
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportToPDF}
                disabled={!data}
              >
                <Download className="h-4 w-4 mr-2" />
                PDF İndir
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                disabled={compareList.length === 0}
              >
                <X className="h-4 w-4 mr-2" />
                Tümünü Temizle
              </Button>
            </div>
          </div>
        </DialogHeader>

        {loading && <LoadingSkeleton />}

        {error && (
          <div className="py-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchCompareData}>Tekrar Dene</Button>
          </div>
        )}

        {!loading && !error && compareList.length < 2 && (
          <div className="py-12 text-center">
            <p className="text-slate-500 mb-4">
              Karşılaştırma için en az 2 ders seçin
            </p>
            <Button onClick={onClose}>Tamam</Button>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <AnalysisCards analysis={data.analysis} />
            <Separator className="my-6" />
            <ComparisonTable
              courses={data.courses}
              analysis={data.analysis}
              onRemove={handleRemove}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
