/**
 * API Client - Backend ile iletişim katmanı.
 * Tüm HTTP istekleri bu modül üzerinden yapılır.
 * Token yönetimi ve hata yakalama merkezi burasıdır.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

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
