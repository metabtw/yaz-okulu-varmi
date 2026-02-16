/**
 * ViewedCoursesSection - Son incelenen dersler.
 */
'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';

interface Interaction {
  id: string;
  courseId: string;
  actionType: string;
  course: {
    id: string;
    name: string;
    ects: number;
    price: number | null;
    university: { name: string; city: string };
  };
}

interface ViewedCoursesSectionProps {
  interactions: Interaction[];
}

export function ViewedCoursesSection({ interactions }: ViewedCoursesSectionProps) {
  const viewInteractions = interactions
    .filter((i) => i.actionType === 'VIEW')
    .slice(0, 3);

  if (viewInteractions.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Son İncelediğim Dersler
        </h2>
        <p className="text-slate-500 text-center py-8">
          Henüz ders detayına bakmadınız.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Son İncelediğim Dersler
      </h2>
      <div className="grid gap-3 sm:grid-cols-3">
        {viewInteractions.map((i) => (
          <Link
            key={i.id}
            href={`/courses/${i.course.id}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900 truncate">{i.course.name}</p>
              <p className="text-sm text-slate-500">
                {i.course.university.name} • {i.course.ects} AKTS
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
