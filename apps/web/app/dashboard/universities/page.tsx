/**
 * Universite Yonetimi Sayfasi (Sadece Admin)
 * Universiteleri listeler, yeni universite ekler, siler.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api';

interface University {
  id: string;
  name: string;
  slug: string;
  city: string;
  website: string | null;
  isVerified: boolean;
  _count: { courses: number; users: number };
  createdAt: string;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', city: '', website: '', contactEmail: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await adminApi.getAllUniversities();
      setUniversities(data);
    } catch (err) {
      console.error('Universiteler yuklenemedi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await adminApi.createUniversity({
        name: formData.name,
        city: formData.city,
        website: formData.website || undefined,
        contactEmail: formData.contactEmail || undefined,
      });
      setShowForm(false);
      setFormData({ name: '', city: '', website: '', contactEmail: '' });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Universite eklenemedi');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    try {
      await adminApi.updateUniversity(id, { isVerified: !currentStatus });
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Islem basarisiz');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu universiteyi ve tum derslerini silmek istediginize emin misiniz?')) return;
    try {
      await adminApi.deleteUniversity(id);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Universite silinemedi');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Universite Yonetimi</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          {showForm ? 'Iptal' : '+ Yeni Universite Ekle'}
        </button>
      </div>

      {/* Universite Ekleme Formu */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-lg border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Yeni Universite</h2>
          {error && <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Universite Adi *</label>
              <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Orn: Bogazici Universitesi" required className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Sehir *</label>
              <input type="text" value={formData.city} onChange={e => setFormData(p => ({ ...p, city: e.target.value }))}
                placeholder="Orn: Istanbul" required className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Web Sitesi</label>
              <input type="url" value={formData.website} onChange={e => setFormData(p => ({ ...p, website: e.target.value }))}
                placeholder="https://..." className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Iletisim E-postasi</label>
              <input type="email" value={formData.contactEmail} onChange={e => setFormData(p => ({ ...p, contactEmail: e.target.value }))}
                placeholder="iletisim@uni.edu.tr" className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm" />
            </div>
          </div>
          <button type="submit" disabled={submitting}
            className="h-9 px-6 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {submitting ? 'Kaydediliyor...' : 'Universiteyi Kaydet'}
          </button>
        </form>
      )}

      {/* Universite Listesi */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yukleniyor...</div>
      ) : universities.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <p className="text-muted-foreground">Henuz universite eklenmemis.</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Universite</th>
                  <th className="text-left text-xs font-medium text-muted-foreground px-4 py-3">Sehir</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Ders</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Yetkili</th>
                  <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3">Durum</th>
                  <th className="text-right text-xs font-medium text-muted-foreground px-4 py-3">Islemler</th>
                </tr>
              </thead>
              <tbody>
                {universities.map(uni => (
                  <tr key={uni.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium">{uni.name}</div>
                      {uni.website && <div className="text-xs text-muted-foreground">{uni.website}</div>}
                    </td>
                    <td className="px-4 py-3 text-sm">{uni.city}</td>
                    <td className="px-4 py-3 text-sm text-center">{uni._count.courses}</td>
                    <td className="px-4 py-3 text-sm text-center">{uni._count.users}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleVerify(uni.id, uni.isVerified)}
                        className={`text-xs px-2 py-1 rounded cursor-pointer ${uni.isVerified ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                        {uni.isVerified ? 'Onayli' : 'Onay Bekliyor'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(uni.id)} className="text-xs text-destructive hover:underline">Sil</button>
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
