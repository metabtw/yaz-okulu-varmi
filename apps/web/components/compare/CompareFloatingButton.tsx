/**
 * CompareFloatingButton - Sabit karşılaştır butonu (sağ alt köşe).
 * Karşılaştırma listesinde ders varsa görünür.
 */
'use client';

import { useState } from 'react';
import { useCompare } from '@/contexts/compare-context';
import { Button } from '@/components/ui/button';
import { GitCompare, X } from 'lucide-react';
import { CompareModal } from './CompareModal';

export function CompareFloatingButton() {
  const { compareList, clearCompare } = useCompare();
  const [isOpen, setIsOpen] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex gap-2 print:hidden">
        <Button
          size="lg"
          onClick={() => setIsOpen(true)}
          className="shadow-2xl hover:scale-105 transition-transform"
        >
          <GitCompare className="mr-2 h-5 w-5" />
          Karşılaştır ({compareList.length})
        </Button>

        <Button
          size="icon"
          variant="destructive"
          onClick={clearCompare}
          className="shadow-2xl h-12 w-12"
          title="Tümünü temizle"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <CompareModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
