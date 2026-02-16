/**
 * TimeSeriesCharts - Günlük görüntülenme, favori ve başvuru grafikleri.
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
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { universityApi } from '@/lib/api';

interface TimeSeriesData {
  dailyViews: { date: string; count: number }[];
  dailyFavorites: { date: string; count: number }[];
  dailyApplications: { date: string; count: number }[];
}

export function TimeSeriesCharts() {
  const [data, setData] = useState<TimeSeriesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    universityApi
      .getTimeSeriesData(30)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) return null;

  const combinedData = data.dailyViews.map((view, index) => ({
    date: new Date(view.date).toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: 'short',
    }),
    Görüntülenme: view.count,
    Favori: data.dailyFavorites[index]?.count ?? 0,
    Başvuru: data.dailyApplications[index]?.count ?? 0,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Günlük Görüntülenme Trendi</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Görüntülenme"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Favori vs Başvuru</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Favori" fill="#ec4899" />
              <Bar dataKey="Başvuru" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
