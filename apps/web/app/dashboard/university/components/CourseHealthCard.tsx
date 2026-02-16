/**
 * CourseHealthCard - Ders sağlık durumu (başvuru linki, tarih eksiklikleri).
 */
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { universityApi } from '@/lib/api';

interface CourseStats {
  total: number;
  withApplicationUrl: number;
  withoutApplicationUrl: number;
  withDates: number;
  withoutDates: number;
  online: number;
  onsite: number;
  healthScore: number;
}

export function CourseHealthCard() {
  const [stats, setStats] = useState<CourseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    universityApi
      .getCourseStatusStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return null;

  const issues: string[] = [];
  if (stats.withoutApplicationUrl > 0) {
    issues.push(`${stats.withoutApplicationUrl} derste başvuru linki eksik`);
  }
  if (stats.withoutDates > 0) {
    issues.push(`${stats.withoutDates} derste tarih bilgisi eksik`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ders Sağlık Durumu</CardTitle>
        <CardDescription>
          Derslerinizin bilgi eksiksizliği
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sağlık Skoru</span>
              <span className="text-2xl font-bold">{stats.healthScore}%</span>
            </div>
            <Progress value={stats.healthScore} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Başvuru Linki</span>
                <div className="flex items-center gap-1">
                  {stats.withApplicationUrl === stats.total ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  )}
                  <span className="text-sm font-medium">
                    {stats.withApplicationUrl}/{stats.total}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Tarih Bilgisi</span>
                <div className="flex items-center gap-1">
                  {stats.withDates === stats.total ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  )}
                  <span className="text-sm font-medium">
                    {stats.withDates}/{stats.total}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Online</span>
                <span className="text-sm font-medium">{stats.online}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Yüz Yüze</span>
                <span className="text-sm font-medium">{stats.onsite}</span>
              </div>
            </div>
          </div>

          {issues.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-900 mb-1">
                    Dikkat!
                  </p>
                  <ul className="text-sm text-amber-800 space-y-1">
                    {issues.map((issue, i) => (
                      <li key={i}>• {issue}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
