/**
 * CourseCard - Modern ders karti.
 * Universite logosu, verified badge, AKTS/Online/Ucret badge'leri.
 * Hover'da sol mavi border + yukari kayma + detay linki.
 */
'use client';

import Link from 'next/link';
import { CheckCircle2, ChevronRight, BookOpen, Globe, MapPin, Coins } from 'lucide-react';
import { useState } from 'react';

interface University {
  id: string;
  name: string;
  slug: string;
  city: string;
  logo?: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  ects: number;
  price?: number | string | null;
  currency?: string;
  isOnline: boolean;
  description?: string;
  university?: University;
}

interface CourseCardProps {
  course: Course | Record<string, unknown>;
}

export function CourseCard({ course }: CourseCardProps) {
  const [hovered, setHovered] = useState(false);

  const c = course as Record<string, unknown>;
  const id = String(c.id || '');
  const code = String(c.code || '');
  const name = String(c.name || '');
  const ects = Number(c.ects || 0);
  const price = c.price ? Number(c.price) : null;
  const currency = String(c.currency || 'TL');
  const isOnline = Boolean(c.isOnline);
  const description = c.description ? String(c.description) : null;

  const uni = c.university as University | undefined;
  const uniName = uni?.name || '';
  const uniCity = uni?.city || '';

  return (
    <Link href={`/courses/${id}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative bg-white rounded-2xl border transition-all duration-300 overflow-hidden card-lift ${
          hovered
            ? 'border-blue-200 shadow-lg shadow-blue-500/5'
            : 'border-slate-200 shadow-sm'
        }`}
      >
        {/* Left accent border */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-2xl transition-opacity duration-300 ${
            hovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="p-5 sm:p-6">
          {/* Header: University info + Verified badge */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* University avatar */}
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div className="min-w-0">
                {uni && (
                  <p className="text-sm text-slate-500 truncate">{uniName}</p>
                )}
                {uni && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{uniCity}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Verified badge */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Onayli</span>
            </div>
          </div>

          {/* Course title */}
          <h3 className="text-lg font-semibold text-slate-900 mb-1 leading-tight">
            {name}
          </h3>
          <p className="text-xs font-mono text-slate-400 mb-4">{code}</p>

          {/* Stats badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* AKTS badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              {ects} AKTS
            </span>

            {/* Online/Yuzyuze badge */}
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
              isOnline
                ? 'bg-violet-50 text-violet-600'
                : 'bg-amber-50 text-amber-600'
            }`}>
              <Globe className="w-3.5 h-3.5" />
              {isOnline ? 'Online' : 'Yuzyuze'}
            </span>

            {/* Price badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs font-medium">
              <Coins className="w-3.5 h-3.5" />
              {price ? `${price.toLocaleString('tr-TR')} ${currency}` : 'Ucretsiz'}
            </span>
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
              {description}
            </p>
          )}

          {/* CTA */}
          <div className={`flex items-center text-sm font-medium text-blue-500 transition-all duration-300 ${
            hovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
          }`}>
            Detaylari Gor
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
