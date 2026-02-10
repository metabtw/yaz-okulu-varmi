/**
 * Ders Yonetimi Sayfasi
 * Admin: Tum dersleri gorur, herhangi bir universiteye ders ekleyebilir.
 * University: Sadece kendi derslerini gorur ve yonetir.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi, courseApi } from '@/lib/api';

interface Course {
  id: string;
  code: string;
  name: string;
  ects: number;
  price: number | null;
  isOnline: boolean;
  university?: { id: string; name: string; city: string };
  updatedAt: string;
}

interface University {
  id: string;
  name: string;
  city: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '', name: '', ects: 0, price: '', isOnline: false,
    description: '', applicationUrl: '', universityId: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const parts = token.split('.');
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        setRole(payload.role || '');
      } catch { /* ignore */ }
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      if (role === 'ADMIN') {
        const [coursesRes, univRes] = await Promise.all([
          adminApi.getAllCourses(),
          adminApi.getAllUniversities(),
        ]);
        setCourses(coursesRes.data as Course[]);
        setUniversities(univRes as University[]);
      } else {
        const data = await courseApi.getMyUniversityCourses();
        setCourses(data as Course[]);
      }
    } catch (err) {
      console.error('Veri yuklenemedi:', err);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (role) loadData();
  }, [role, loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        code: formData.code,
        name: formData.name,
        ects: Number(formData.ects),
        price: formData.price ? Number(formData.price) : undefined,
        isOnline: formData.isOnline,
        description: formData.description || undefined,
        applicationUrl: formData.applicationUrl || undefined,
        universityId: formData.universityId || undefined,
      };

      if (role === 'ADMIN') {
        if (!formData.universityId) {
          setError('Lutfen bir universite secin');
          setSubmitting(false);
          return;
        }
        await adminApi.createCourse(payload);
      } else {
        await courseApi.create(payload);
      }

      setShowForm(false);
      setFormData({ code: '', name: '', ects: 0, price: '', isOnline: false, description: '', applicationUrl: '', universityId: '' });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ders eklenemedi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu dersi silmek istediginize emin misiniz?')) return;
    try {
      if (role === 'ADMIN') {
        await adminApi.deleteCourse(id);
      } else {
        await courseApi.delete(id);
      }
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ders silinemedi');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ders Yonetimi</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {showForm ? 'Iptal' : '+ Yeni Ders Ekle'}
        </button>
      </div>

      {/* Ders Ekleme Formu */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Yeni Ders Bilgileri</h2>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Admin: Üniversite seçimi */}
            {role === 'ADMIN' && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Universite *</label>
                <select
                  value={formData.universityId}
                  onChange={(e) => setFormData(p => ({ ...p, universityId: e.target.value }))}
                  required
                  className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Universite secin...</option>
                  {universities.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.city})</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1.5">Ders Kodu *</label>
              <input type="text" value={formData.code} onChange={e => setFormData(p => ({ ...p, code: e.target.value }))}
                placeholder="Orn: MAT101" required className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Ders Adi *</label>
              <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Orn: Matematik I" required className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">AKTS *</label>
              <input type="number" value={formData.ects || ''} onChange={e => setFormData(p => ({ ...p, ects: parseInt(e.target.value) || 0 }))}
                min={1} max={30} required className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Ucret (TL)</label>
              <input type="number" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                min={0} placeholder="Bos birakilirsa ucretsiz" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" id="isOnline" checked={formData.isOnline}
              onChange={e => setFormData(p => ({ ...p, isOnline: e.target.checked }))} className="h-4 w-4 rounded border-input" />
            <label htmlFor="isOnline" className="text-sm">Uzaktan egitim (Online)</label>
          </div>
          <button type="submit" disabled={submitting}
            className="h-9 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Kaydediliyor...' : 'Dersi Kaydet'}
          </button>
        </form>
      )}

      {/* Ders Listesi */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yukleniyor...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Henuz ders eklenmemis.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Kod</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Ders Adi</th>
                  {role === 'ADMIN' && <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Universite</th>}
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">AKTS</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Ucret</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Tur</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Islem</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3 text-sm font-mono">{course.code}</td>
                    <td className="px-4 py-3 text-sm font-medium">{course.name}</td>
                    {role === 'ADMIN' && (
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {course.university?.name ?? '-'}
                      </td>
                    )}
                    <td className="px-4 py-3 text-sm text-center">{course.ects}</td>
                    <td className="px-4 py-3 text-sm text-right">
                      {course.price ? `${Number(course.price).toLocaleString('tr-TR')} TL` : 'Ucretsiz'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${course.isOnline ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                        {course.isOnline ? 'Online' : 'Yuz Yuze'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(course.id)} className="text-xs text-destructive hover:underline">Sil</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
