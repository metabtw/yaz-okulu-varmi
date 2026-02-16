/**
 * CompareContext - Ders karşılaştırma listesi için merkezi state yönetimi.
 * LocalStorage ile kalıcılık sağlar (sayfa yenilenince kaybolmaz).
 */
'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

interface CompareContextType {
  compareList: string[];
  addToCompare: (courseId: string) => void;
  removeFromCompare: (courseId: string) => void;
  clearCompare: () => void;
  isInCompare: (courseId: string) => boolean;
  canAddMore: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 4;
const STORAGE_KEY = 'compare-list';

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as string[];
        if (Array.isArray(parsed)) {
          setCompareList(parsed.slice(0, MAX_COMPARE));
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [mounted]);

  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(compareList));
  }, [compareList, mounted]);

  const addToCompare = useCallback((courseId: string) => {
    setCompareList((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      if (prev.includes(courseId)) return prev;
      return [...prev, courseId];
    });
  }, []);

  const removeFromCompare = useCallback((courseId: string) => {
    setCompareList((prev) => prev.filter((id) => id !== courseId));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareList([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const isInCompare = useCallback(
    (courseId: string) => compareList.includes(courseId),
    [compareList],
  );

  const canAddMore = compareList.length < MAX_COMPARE;

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}

export function useCompareOptional() {
  return useContext(CompareContext);
}
