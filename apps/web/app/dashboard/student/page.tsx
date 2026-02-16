/**
 * Öğrenci Dashboard - Öğrenci paneli ana sayfası.
 * Favoriler, öneriler, arama geçmişi ve analitikler.
 */
'use client';

import { useEffect, useState } from 'react';
import { studentApi } from '@/lib/api';
import { WelcomeCard } from './components/WelcomeCard';
import { QuickActions } from './components/QuickActions';
import { RecommendationsSection } from './components/RecommendationsSection';
import { FavoritesTable } from './components/FavoritesTable';
import { SearchHistoryList } from './components/SearchHistoryList';
import { ViewedCoursesSection } from './components/ViewedCoursesSection';
import { PersonalAnalytics } from './components/PersonalAnalytics';

export default function StudentDashboardPage() {
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);
  const [favorites, setFavorites] = useState<unknown[]>([]);
  const [searchHistory, setSearchHistory] = useState<unknown[]>([]);
  const [recommendations, setRecommendations] = useState<unknown[]>([]);
  const [interactions, setInteractions] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setError(null);
      const [p, s, f, h, r, i] = await Promise.all([
        studentApi.getProfile(),
        studentApi.getStats(),
        studentApi.getFavorites(),
        studentApi.getSearchHistory(),
        studentApi.getRecommendations(),
        studentApi.getInteractions(),
      ]);
      setProfile(p);
      setStats(s);
      setFavorites(Array.isArray(f) ? f : []);
      setSearchHistory(Array.isArray(h) ? h : []);
      setRecommendations(Array.isArray(r) ? r : []);
      setInteractions(Array.isArray(i) ? i : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-red-700 font-medium">{error}</p>
        <button
          type="button"
          onClick={loadData}
          className="mt-4 px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Öğrenci Paneli</h1>

      <WelcomeCard
        profile={
          profile as {
            fullName: string | null;
            email: string;
          }
        }
        stats={
          stats as {
            totalSearches: number;
            totalFavorites: number;
            totalInteractions: number;
            lastSearchDate: string | null;
          }
        }
      />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecommendationsSection
          courses={recommendations as Array<{
            id: string;
            name: string;
            code: string;
            ects: number;
            price: number | null;
            currency: string;
            isOnline: boolean;
            university: { id: string; name: string; city: string };
          }>}
          onFavoriteAdded={loadData}
        />
        <FavoritesTable
          favorites={favorites as Array<{
            id: string;
            name: string;
            university: { name: string };
            ects: number;
            price: number | null;
            currency: string;
          }>}
          onRemoved={loadData}
        />
      </div>

      <SearchHistoryList
        history={
          searchHistory as Array<{
            id: string;
            searchQuery: string | null;
            filters: Record<string, unknown>;
            resultCount: number;
            createdAt: string;
          }>
        }
      />

      <ViewedCoursesSection
        interactions={
          interactions as Array<{
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
          }>
        }
      />

      <PersonalAnalytics
        stats={
          stats as {
            topSearchedCity: string | null;
            avgEctsInterest: number;
            totalSearches: number;
          }
        }
      />
    </div>
  );
}
