/**
 * FavoritesContext - Favori derslerin merkezi state yönetimi.
 * Tüm sayfalarda (search, detail, dashboard) favori durumu senkron kalır.
 */
'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { studentApi } from '@/lib/api';

interface FavoritesContextValue {
  favoriteIds: Set<string>;
  isLoading: boolean;
  isStudent: boolean;
  addFavorite: (courseId: string) => Promise<void>;
  removeFavorite: (courseId: string) => Promise<void>;
  refetch: () => Promise<void>;
  isFavorited: (courseId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    if (!token) {
      setIsStudent(false);
      setFavoriteIds(new Set());
      return;
    }

    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      if (payload.role !== 'STUDENT') {
        setIsStudent(false);
        setFavoriteIds(new Set());
        return;
      }

      setIsStudent(true);
      setIsLoading(true);
      const favorites = await studentApi.getFavorites();
      const ids = new Set(
        (favorites || []).map((c: { id: string }) => c.id),
      );
      setFavoriteIds(ids);
    } catch {
      setFavoriteIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async (courseId: string) => {
      if (!isStudent) return;
      try {
        await studentApi.addFavorite(courseId);
        setFavoriteIds((prev) => new Set([...prev, courseId]));
      } catch {
        throw new Error('Favori eklenemedi');
      }
    },
    [isStudent],
  );

  const removeFavorite = useCallback(
    async (courseId: string) => {
      if (!isStudent) return;
      try {
        await studentApi.removeFavorite(courseId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(courseId);
          return next;
        });
      } catch {
        throw new Error('Favoriden kaldırılamadı');
      }
    },
    [isStudent],
  );

  const isFavorited = useCallback(
    (courseId: string) => favoriteIds.has(courseId),
    [favoriteIds],
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      isLoading,
      isStudent,
      addFavorite,
      removeFavorite,
      refetch: fetchFavorites,
      isFavorited,
    }),
    [
      favoriteIds,
      isLoading,
      isStudent,
      addFavorite,
      removeFavorite,
      fetchFavorites,
      isFavorited,
    ],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return ctx;
}

// Optional: hook that returns null if outside provider (for gradual adoption)
export function useFavoritesOptional() {
  return useContext(FavoritesContext);
}
