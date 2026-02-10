/**
 * Onay Bekleyenler Sayfasi (Sadece Admin)
 * PENDING durumundaki universite yetkililerini listeler.
 * Admin onaylayabilir veya reddedebilir.
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '@/lib/api';

interface PendingUser {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  status: string;
  university: { id: string; name: string; city: string } | null;
  createdAt: string;
}

export default function PendingRequestsPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const data = await adminApi.getPendingRequests();
      setPendingUsers(data);
    } catch (err) {
      console.error('Veri yuklenemedi:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleApprove = async (userId: string) => {
    setProcessing(userId);
    try {
      await adminApi.approveUser(userId);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Onaylama basarisiz');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!confirm('Bu basvuruyu reddetmek istediginize emin misiniz?')) return;
    setProcessing(userId);
    try {
      await adminApi.rejectUser(userId);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Reddetme basarisiz');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Onay Bekleyen Basvurular</h1>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Yukleniyor...</div>
      ) : pendingUsers.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-medium text-foreground">Tum basvurular incelendi</p>
          <p className="text-sm text-muted-foreground mt-1">Bekleyen basvuru bulunmuyor.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map(user => (
            <div key={user.id} className="bg-card rounded-lg border border-border p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold">{user.fullName || 'Isim belirtilmemis'}</h3>
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">PENDING</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.university && (
                    <p className="text-sm text-primary mt-1">
                      {user.university.name} - {user.university.city}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Basvuru: {new Date(user.createdAt).toLocaleDateString('tr-TR', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(user.id)}
                    disabled={processing === user.id}
                    className="h-9 px-4 rounded-md bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    {processing === user.id ? '...' : 'Onayla'}
                  </button>
                  <button
                    onClick={() => handleReject(user.id)}
                    disabled={processing === user.id}
                    className="h-9 px-4 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-colors"
                  >
                    Reddet
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
