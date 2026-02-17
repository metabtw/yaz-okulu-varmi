/**
 * CompareButton - Ders detay sayfasında karşılaştırmaya ekleme butonu.
 */
'use client';

import { useCompareOptional } from '@/contexts/compare-context';
import { Checkbox } from '@/components/ui/checkbox';
import { GitCompare } from 'lucide-react';

interface CompareButtonProps {
  courseId: string;
  className?: string; // className prop'u eklendi
}

export function CompareButton({ courseId, className }: CompareButtonProps) {
  const compareCtx = useCompareOptional();
  if (!compareCtx) return null;

  const inCompare = compareCtx.isInCompare(courseId);
  const canAdd = compareCtx.canAddMore;

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 ${className || ''}`}>
      <Checkbox
        id={`compare-detail-${courseId}`}
        checked={inCompare}
        onCheckedChange={(checked) => {
          if (checked) {
            compareCtx.addToCompare(courseId);
          } else {
            compareCtx.removeFromCompare(courseId);
          }
        }}
        disabled={!inCompare && !canAdd}
      />
      <label
        htmlFor={`compare-detail-${courseId}`}
        className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2"
      >
        <GitCompare className="w-4 h-4 text-slate-500" />
        Karşılaştırmaya Ekle
      </label>
    </div>
  );
}