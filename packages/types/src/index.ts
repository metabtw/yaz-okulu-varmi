/**
 * Ortak TypeScript Tipleri
 * Backend ve Frontend'in paylaştığı enum, DTO ve response tipleri.
 * Bu paket her iki tarafta da import edilebilir.
 */

// ---- Roller ----

export enum Role {
  STUDENT = 'STUDENT',
  UNIVERSITY = 'UNIVERSITY',
  ADMIN = 'ADMIN',
}

// ---- User Tipleri ----

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: Role;
  universityId: string | null;
  createdAt: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// ---- University Tipleri ----

export interface University {
  id: string;
  name: string;
  slug: string;
  city: string;
  logo: string | null;
  website: string | null;
  contactEmail: string | null;
  isVerified: boolean;
  widgetConfig: WidgetConfig | null;
  createdAt: string;
  updatedAt: string;
}

export interface UniversitySummary {
  id: string;
  name: string;
  slug: string;
  city: string;
  logo: string | null;
  _count: { courses: number };
}

export interface WidgetConfig {
  primaryColor: string;
  theme: 'light' | 'dark';
}

// ---- Course Tipleri ----

export interface Course {
  id: string;
  code: string;
  name: string;
  ects: number;
  price: string | null; // Decimal -> string olarak gelir
  currency: string;
  isOnline: boolean;
  description: string | null;
  applicationUrl: string | null;
  quota: number | null;
  startDate: string | null;
  endDate: string | null;
  universityId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseWithUniversity extends Course {
  university: UniversitySummary;
}

// ---- API Response Tipleri ----

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ---- Search Tipleri ----

export interface SearchFilters {
  q?: string;
  city?: string;
  universityId?: string;
  isOnline?: string;
  minEcts?: string;
  maxEcts?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: string;
  limit?: string;
  sortBy?: 'name' | 'price' | 'ects' | 'createdAt' | 'startDate';
  sortOrder?: 'asc' | 'desc';
}

// ---- Stats Tipleri (Admin) ----

export interface PlatformStats {
  totalSearches: number;
  totalCourses: number;
  totalUniversities: number;
  todaySearches: number;
}

export interface PopularSearch {
  query: string | null;
  count: number;
}

export interface DailyStats {
  date: string;
  searchCount: number;
  avgResults: number;
}

// ---- Widget Tipleri ----

export interface WidgetData {
  university: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  config: WidgetConfig | null;
  courses: Array<{
    id: string;
    code: string;
    name: string;
    ects: number;
    price: string | null;
    currency: string;
    isOnline: boolean;
    applicationUrl: string | null;
    startDate: string | null;
    endDate: string | null;
  }>;
  totalCourses: number;
  generatedAt: string;
}

// ---- API Error Tipi ----

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | { message: string; errors: Array<{ field: string; message: string }> };
}
