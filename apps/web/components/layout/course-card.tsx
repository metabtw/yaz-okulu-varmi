/**
 * CourseCard - Arama sonuçlarında gösterilen ders kartı.
 * Ders adı, üniversite, AKTS, ücret ve online/yüzyüze bilgisi gösterir.
 */
import Link from 'next/link';

interface CourseCardProps {
  course: Record<string, unknown>;
}

export function CourseCard({ course }: CourseCardProps) {
  const university = course.university as Record<string, unknown> | undefined;

  return (
    <div className="rounded-lg border border-border bg-card p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Sol: Ders Bilgileri */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
              {course.code as string}
            </span>
            {course.isOnline && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Uzaktan
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-foreground truncate">
            {course.name as string}
          </h3>
          {university && (
            <p className="text-sm text-muted-foreground mt-1">
              {university.name as string} - {university.city as string}
            </p>
          )}
        </div>

        {/* Sağ: AKTS ve Ücret */}
        <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 shrink-0">
          <div className="text-sm font-medium text-foreground">
            {course.ects as number} AKTS
          </div>
          {course.price && (
            <div className="text-lg font-bold text-primary">
              {Number(course.price).toLocaleString('tr-TR')} {(course.currency as string) || 'TL'}
            </div>
          )}
          {!course.price && (
            <div className="text-sm text-muted-foreground">Ücretsiz</div>
          )}
        </div>
      </div>

      {/* Alt: Detay Butonu */}
      <div className="mt-4 flex items-center justify-between">
        {course.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 flex-1 mr-4">
            {course.description as string}
          </p>
        )}
        <Link
          href={`/courses/${course.id as string}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline shrink-0"
        >
          Detaylar
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
