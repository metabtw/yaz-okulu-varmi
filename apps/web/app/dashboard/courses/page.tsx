/**
 * Ders Yönetimi Sayfası - Tam CRUD (Ekle, Düzenle, Sil).
 * Admin: Tüm dersleri görür, herhangi bir üniversiteye ders ekleyebilir.
 * University: Sadece kendi derslerini görür ve yönetir.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi, courseApi } from '@/lib/api';
import { Modal } from '@/components/layout/modal';
import { Plus, Pencil, Trash2, X, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  ects: number;
  price: number | string | null;
  currency?: string;
  isOnline: boolean;
  description?: string;
  applicationUrl?: string;
  quota?: number | null;
  university?: { id: string; name: string; city: string };
  updatedAt: string;
}

interface University {
  id: string;
  name: string;
  city: string;
}

const emptyForm = {
  code: '', name: '', ects: '', price: '', isOnline: false,
  description: '', applicationUrl: '', universityId: '', quota: '',
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Modal states
  const [modal, setModal] = useState<{
    open: boolean;
    type: 'confirm' | 'error' | 'success' | 'info';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({ open: false, type: 'info', title: '', message: '' });

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
      } else if (role === 'UNIVERSITY') {
        const data = await courseApi.getMyUniversityCourses();
        setCourses(data as Course[]);
      }
    } catch (err) {
      setModal({
        open: true, type: 'error',
        title: 'Veri Yüklenemedi',
        message: err instanceof Error ? err.message : 'Dersler yüklenirken bir hata oluştu.',
      });
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (role) loadData();
  }, [role, loadData]);

  const openCreateForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (course: Course) => {
    setEditingId(course.id);
    setFormData({
      code: course.code,
      name: course.name,
      ects: String(course.ects),
      price: course.price ? String(course.price) : '',
      isOnline: course.isOnline,
      description: course.description || '',
      applicationUrl: course.applicationUrl || '',
      universityId: course.university?.id || '',
      quota: course.quota ? String(course.quota) : '',
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        code: formData.code,
        name: formData.name,
        ects: Number(formData.ects),
        isOnline: formData.isOnline,
      };

      // Sadece doldurulan opsiyonel alanları ekle
      if (formData.price) payload.price = Number(formData.price);
      if (formData.description) payload.description = formData.description;
      if (formData.applicationUrl) payload.applicationUrl = formData.applicationUrl;
      if (formData.quota) payload.quota = Number(formData.quota);

      if (editingId) {
        // DÜZENLEME
        if (role === 'UNIVERSITY') {
          await courseApi.update(editingId, payload);
        } else {
          // Admin şimdilik sadece sil ve yeniden ekle
          setModal({
            open: true, type: 'info',
            title: 'Bilgi',
            message: 'Admin olarak ders düzenleme özelliği yakında eklenecektir. Şimdilik dersi silip yeniden ekleyebilirsiniz.',
          });
          setSubmitting(false);
          return;
        }
      } else {
        // YENİ EKLEME
        if (role === 'ADMIN') {
          if (!formData.universityId) {
            setModal({
              open: true, type: 'error',
              title: 'Eksik Bilgi',
              message: 'Lütfen bir üniversite seçin.',
            });
            setSubmitting(false);
            return;
          }
          payload.universityId = formData.universityId;
          await adminApi.createCourse(payload);
        } else {
          await courseApi.create(payload);
        }
      }

      closeForm();
      await loadData();
      setModal({
        open: true, type: 'success',
        title: editingId ? 'Ders Güncellendi' : 'Ders Eklendi',
        message: editingId
          ? `"${formData.name}" dersi başarıyla güncellendi.`
          : `"${formData.name}" dersi başarıyla eklendi.`,
      });
    } catch (err) {
      setModal({
        open: true, type: 'error',
        title: 'İşlem Başarısız',
        message: err instanceof Error ? err.message : 'Ders kaydedilemedi. Lütfen bilgileri kontrol edin.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (course: Course) => {
    setModal({
      open: true, type: 'confirm',
      title: 'Dersi Sil',
      message: `"${course.name}" dersini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
      onConfirm: async () => {
        try {
          if (role === 'ADMIN') {
            await adminApi.deleteCourse(course.id);
          } else {
            await courseApi.delete(course.id);
          }
          await loadData();
          setModal({
            open: true, type: 'success',
            title: 'Ders Silindi',
            message: `"${course.name}" dersi başarıyla silindi.`,
          });
        } catch (err) {
          setModal({
            open: true, type: 'error',
            title: 'Silme Başarısız',
            message: err instanceof Error ? err.message : 'Ders silinemedi.',
          });
        }
      },
    });
  };

  const updateField = (field: string, value: string | boolean | number) => {
    setFormData((p) => ({ ...p, [field]: value }));
  };

  return (
    <div>
      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmLabel={modal.type === 'confirm' ? 'Evet, Sil' : 'Tamam'}
        cancelLabel="Vazgeç"
      />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Ders Yönetimi</h1>
        {!showForm && (
          <button
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni Ders Ekle
          </button>
        )}
      </div>

      {/* Ders Ekleme/Düzenleme Formu */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId ? 'Dersi Düzenle' : 'Yeni Ders Bilgileri'}
            </h2>
            <button onClick={closeForm} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {role === 'ADMIN' && !editingId && (
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Üniversite *</label>
                  <select
                    value={formData.universityId}
                    onChange={(e) => updateField('universityId', e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  >
                    <option value="">Üniversite seçin...</option>
                    {universities.map((u) => (
                      <option key={u.id} value={u.id}>{u.name} ({u.city})</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ders Kodu *</label>
                <input type="text" value={formData.code} onChange={(e) => updateField('code', e.target.value)}
                  placeholder="Örn: MAT101" required className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ders Adı *</label>
                <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Örn: Matematik I" required className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">AKTS *</label>
                <input type="number" value={formData.ects} onChange={(e) => updateField('ects', e.target.value)}
                  min={1} max={30} required className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Ücret (TL)</label>
                <input type="number" value={formData.price} onChange={(e) => updateField('price', e.target.value)}
                  min={0} step="0.01" placeholder="Boş = ücretsiz" className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Kontenjan</label>
                <input type="number" value={formData.quota} onChange={(e) => updateField('quota', e.target.value)}
                  min={0} placeholder="Örn: 50" className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Başvuru Linki</label>
                <input type="url" value={formData.applicationUrl} onChange={(e) => updateField('applicationUrl', e.target.value)}
                  placeholder="https://..." className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Açıklama</label>
                <textarea value={formData.description} onChange={(e) => updateField('description', e.target.value)}
                  rows={3} placeholder="Ders hakkında kısa açıklama..." className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isOnline}
                  onChange={(e) => updateField('isOnline', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/20" />
                <span className="text-sm text-slate-700">Uzaktan eğitim (Online)</span>
              </label>
            </div>

            <div className="flex items-center gap-3">
              <button type="submit" disabled={submitting}
                className="h-10 px-6 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 disabled:opacity-50 transition-all shadow-sm">
                {submitting ? 'Kaydediliyor...' : editingId ? 'Değişiklikleri Kaydet' : 'Dersi Kaydet'}
              </button>
              <button type="button" onClick={closeForm}
                className="h-10 px-6 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-200 transition-all">
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ders Listesi */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-lg font-semibold text-slate-900 mb-1">Henüz ders eklenmemiş</p>
          <p className="text-sm text-slate-500 mb-4">İlk dersinizi ekleyerek başlayabilirsiniz.</p>
          <button onClick={openCreateForm}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 transition-all">
            <Plus className="w-4 h-4" /> Ders Ekle
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Kod</th>
                  <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Ders Adı</th>
                  {role === 'ADMIN' && <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Üniversite</th>}
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">AKTS</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Ücret</th>
                  <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Tür</th>
                  <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-slate-50 last:border-0 hover:bg-blue-50/30 transition-colors">
                    <td className="px-5 py-4 text-sm font-mono text-slate-600">{course.code}</td>
                    <td className="px-5 py-4 text-sm font-medium text-slate-900">{course.name}</td>
                    {role === 'ADMIN' && (
                      <td className="px-5 py-4 text-sm text-slate-500">{course.university?.name ?? '-'}</td>
                    )}
                    <td className="px-5 py-4 text-sm text-center text-slate-700">{course.ects}</td>
                    <td className="px-5 py-4 text-sm text-right font-medium text-slate-900">
                      {course.price ? `${Number(course.price).toLocaleString('tr-TR')} TL` : 'Ücretsiz'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${
                        course.isOnline ? 'bg-violet-50 text-violet-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {course.isOnline ? 'Online' : 'Yüzyüze'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {role === 'UNIVERSITY' && (
                          <button
                            onClick={() => openEditForm(course)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                            title="Düzenle"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(course)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
