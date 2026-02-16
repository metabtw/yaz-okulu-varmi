/**
 * Üniversite Dashboard - Analitikler ve widget ayarları.
 * Sadece UNIVERSITY rolü erişebilir.
 */
'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { universityApi } from '@/lib/api';
import { OverviewCards } from './components/OverviewCards';
import { PopularCoursesTable } from './components/PopularCoursesTable';
import { TimeSeriesCharts } from './components/TimeSeriesCharts';
import { CourseHealthCard } from './components/CourseHealthCard';
import { WidgetSection } from './components/WidgetSection';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function OverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-2xl" />
      ))}
    </div>
  );
}

export default function UniversityDashboardPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    try {
      const payload = JSON.parse(
        atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      );
      if (payload.role !== 'UNIVERSITY') {
        router.push('/dashboard');
        return;
      }
      setRole(payload.role);
    } catch {
      router.push('/login');
    }
  }, [router]);

  if (!role) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Derslerinizin performansını takip edin
        </p>
      </div>

      <Suspense fallback={<OverviewSkeleton />}>
        <OverviewCards />
      </Suspense>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList>
          <TabsTrigger value="analytics">Analitikler</TabsTrigger>
          <TabsTrigger value="widget">Widget Ayarları</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <Suspense fallback={<Skeleton className="h-32 rounded-2xl" />}>
            <CourseHealthCard />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <PopularCoursesTable />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <TimeSeriesCharts />
          </Suspense>
        </TabsContent>

        <TabsContent value="widget">
          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            <WidgetSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
