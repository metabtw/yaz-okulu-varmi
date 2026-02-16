/**
 * API Client - Backend ile iletişim katmanı.
 * Tüm HTTP istekleri bu modül üzerinden yapılır.
 * Token yönetimi ve hata yakalama merkezi burasıdır.
 */

const _base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
const API_BASE_URL = _base.endsWith('/api') ? _base : `${_base.replace(/\/?$/, '')}/api`;

/** Genel fetch wrapper - Hata yönetimi ve token ekleme. */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP ${response.status}`,
    }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ---- Auth API ----

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    fullName?: string;
    role?: string;
    universityName?: string;
    city?: string;
  }) =>
    fetchApi<{ user: Record<string, unknown>; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    fetchApi<{ user: Record<string, unknown>; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ---- Course API ----

export const courseApi = {
  search: (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi<{ data: unknown[]; meta: Record<string, number> }>(`/courses?${query}`);
  },

  getById: (id: string) => fetchApi<Record<string, unknown>>(`/courses/${id}`),

  compare: (courseIds: string[]) =>
    fetchApi<{
      courses: Array<Record<string, unknown>>;
      analysis: Record<string, unknown>;
      comparedAt: string;
    }>(`/courses/compare?ids=${courseIds.join(',')}`),

  getMyUniversityCourses: () => fetchApi<unknown[]>('/university/courses'),

  create: (data: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>('/university/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>(`/university/courses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchApi<{ message: string }>(`/university/courses/${id}`, {
      method: 'DELETE',
    }),
};

// ---- University API ----

export const universityApi = {
  getAll: () => fetchApi<unknown[]>('/universities'),
  getById: (id: string) => fetchApi<Record<string, unknown>>(`/universities/${id}`),
  update: (id: string, data: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>(`/universities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  updateWidget: (id: string, data: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>(`/universities/${id}/widget`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Dashboard analytics (UNIVERSITY rolü gerekli)
  getDashboardOverview: () =>
    fetchApi<{
      totalCourses: number;
      newCoursesLastMonth: number;
      totalViews: number;
      recentViews: number;
      viewsChangePercent: number;
      totalFavorites: number;
      recentFavorites: number;
      favoritesChangePercent: number;
      totalApplicationClicks: number;
      recentApplicationClicks: number;
      applicationsChangePercent: number;
    }>('/university/dashboard/overview'),

  getPopularCourses: (limit?: number) =>
    fetchApi<
      Array<{
        id: string;
        name: string;
        code: string;
        ects: number;
        price: number | null;
        currency: string;
        isOnline: boolean;
        viewCount: number;
        favoriteCount: number;
        applicationClicks: number;
        conversionRate: number;
      }>
    >(`/university/dashboard/popular-courses${limit ? `?limit=${limit}` : ''}`),

  getTimeSeriesData: (days?: number) =>
    fetchApi<{
      dailyViews: Array<{ date: string; count: number }>;
      dailyFavorites: Array<{ date: string; count: number }>;
      dailyApplications: Array<{ date: string; count: number }>;
    }>(`/university/dashboard/time-series${days ? `?days=${days}` : ''}`),

  getCourseStatusStats: () =>
    fetchApi<{
      total: number;
      withApplicationUrl: number;
      withoutApplicationUrl: number;
      withDates: number;
      withoutDates: number;
      online: number;
      onsite: number;
      healthScore: number;
    }>('/university/dashboard/course-stats'),
};

// ---- User API ----

export const userApi = {
  getMe: () => fetchApi<{
    id: string;
    email: string;
    fullName: string | null;
    role: string;
    status: string;
    universityId: string | null;
    university?: {
      id: string;
      name: string;
      slug: string;
      city: string;
      website: string | null;
      contactEmail: string | null;
      widgetConfig: Record<string, unknown> | null;
    };
  }>('/users/me'),
};

// ---- Student API ----

export const studentApi = {
  getProfile: () =>
    fetchApi<{
      id: string;
      fullName: string | null;
      email: string;
      department?: string | null;
      preferredCities?: string[];
      university?: { id: string; name: string; city: string };
    }>('/student/profile'),

  getStats: () =>
    fetchApi<{
      totalSearches: number;
      totalFavorites: number;
      totalInteractions: number;
      topSearchedCity: string | null;
      avgEctsInterest: number;
      lastSearchDate: string | null;
    }>('/student/stats'),

  getFavorites: () =>
    fetchApi<
      Array<{
        id: string;
        name: string;
        code: string;
        ects: number;
        price: number | null;
        currency: string;
        isOnline: boolean;
        university: { id: string; name: string; slug: string; city: string; logo?: string };
      }>
    >('/student/favorites'),

  addFavorite: (courseId: string) =>
    fetchApi<{ message: string }>('/student/favorites', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    }),

  removeFavorite: (courseId: string) =>
    fetchApi<{ message: string }>(`/student/favorites/${courseId}`, {
      method: 'DELETE',
    }),

  getSearchHistory: () =>
    fetchApi<
      Array<{
        id: string;
        searchQuery: string | null;
        filters: Record<string, unknown>;
        resultCount: number;
        createdAt: string;
      }>
    >('/student/search-history'),

  getInteractions: () =>
    fetchApi<
      Array<{
        id: string;
        courseId: string;
        actionType: string;
        createdAt: string;
        course: {
          id: string;
          name: string;
          ects: number;
          price: number | null;
          university: { name: string; city: string };
        };
      }>
    >('/student/interactions'),

  getRecommendations: () =>
    fetchApi<
      Array<{
        id: string;
        name: string;
        code: string;
        ects: number;
        price: number | null;
        currency: string;
        isOnline: boolean;
        university: { id: string; name: string; slug: string; city: string; logo?: string };
      }>
    >('/student/recommendations'),

  recordInteraction: (courseId: string, actionType: 'VIEW' | 'FAVORITE' | 'APPLY') =>
    fetchApi<{ message: string }>('/student/interactions', {
      method: 'POST',
      body: JSON.stringify({ courseId, actionType }),
    }),
};

// ---- Widget API ----

export const widgetApi = {
  getData: (univId: string) => fetchApi<Record<string, unknown>>(`/widget/${univId}`),
};

// ---- Admin API ----

export const adminApi = {
  // Dashboard
  getDashboardStats: () =>
    fetchApi<{
      totalCourses: number;
      totalUniversities: number;
      verifiedUniversities: number;
      totalUsers: number;
      pendingUsers: number;
      totalSearches: number;
      onlineCourses: number;
      todaySearches: number;
    }>('/admin/dashboard'),

  // Pending Requests
  getPendingRequests: () =>
    fetchApi<Array<{
      id: string;
      email: string;
      fullName: string | null;
      role: string;
      status: string;
      university: { id: string; name: string; city: string } | null;
      createdAt: string;
    }>>('/admin/pending-requests'),

  approveUser: (id: string) =>
    fetchApi<Record<string, unknown>>(`/admin/users/${id}/approve`, { method: 'PATCH' }),

  rejectUser: (id: string) =>
    fetchApi<Record<string, unknown>>(`/admin/users/${id}/reject`, { method: 'PATCH' }),

  // Universities
  getAllUniversities: () =>
    fetchApi<Array<{
      id: string;
      name: string;
      slug: string;
      city: string;
      website: string | null;
      isVerified: boolean;
      _count: { courses: number; users: number };
      createdAt: string;
    }>>('/admin/universities'),

  createUniversity: (data: { name: string; city: string; website?: string; contactEmail?: string }) =>
    fetchApi<Record<string, unknown>>('/admin/universities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUniversity: (id: string, data: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>(`/admin/universities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteUniversity: (id: string) =>
    fetchApi<{ message: string }>(`/admin/universities/${id}`, { method: 'DELETE' }),

  // Courses
  getAllCourses: (page?: number, limit?: number) =>
    fetchApi<{
      data: Array<{
        id: string;
        code: string;
        name: string;
        ects: number;
        price: number | null;
        isOnline: boolean;
        university: { id: string; name: string; city: string };
      }>;
      meta: { total: number; page: number; limit: number; totalPages: number };
    }>(`/admin/courses?page=${page || 1}&limit=${limit || 50}`),

  createCourse: (data: Record<string, unknown>) =>
    fetchApi<Record<string, unknown>>('/admin/courses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  deleteCourse: (id: string) =>
    fetchApi<{ message: string }>(`/admin/courses/${id}`, { method: 'DELETE' }),
};
