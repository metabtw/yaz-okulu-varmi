/**
 * TrackCourseView - Giriş yapmış öğrencinin ders görüntülemesini kaydeder.
 * Course detail sayfasına eklenir.
 */
'use client';

import { useEffect } from 'react';
import { studentApi } from '@/lib/api';

interface TrackCourseViewProps {
  courseId: string;
}

export function TrackCourseView({ courseId }: TrackCourseViewProps) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.role !== 'STUDENT') return;

      studentApi.recordInteraction(courseId, 'VIEW').catch(() => {
        // Sessizce yoksay - öneriler için kritik değil
      });
    } catch {
      // Token parse hatası
    }
  }, [courseId]);

  return null;
}
