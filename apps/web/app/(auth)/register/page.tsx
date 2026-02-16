/**
 * Kayıt Sayfası - Öğrenci veya Üniversite Yetkilisi kaydı.
 * Üniversite yetkilisi seçildiğinde: .edu.tr uyarısı + üniversite bilgileri.
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'STUDENT' as 'STUDENT' | 'UNIVERSITY',
    universityName: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isUniversity = formData.role === 'UNIVERSITY';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Frontend'de .edu.tr kontrolü
    if (isUniversity && !formData.email.endsWith('.edu.tr')) {
      setError('Üniversite yetkilisi kaydı için .edu.tr uzantılı kurumsal e-posta zorunludur.');
      return;
    }

    if (isUniversity && !formData.universityName.trim()) {
      setError('Lütfen üniversite adını giriniz.');
      return;
    }

    setLoading(true);

    try {
      const result = await authApi.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName || undefined,
        role: formData.role,
        universityName: isUniversity ? formData.universityName : undefined,
        city: isUniversity ? formData.city : undefined,
      });
      localStorage.setItem('token', result.token);
      document.cookie = `token=${result.token}; path=/; max-age=${7 * 24 * 60 * 60}`;

      // Üniversite yetkilisi -> pending sayfasına, öğrenci -> dashboard'a
      if (formData.role === 'UNIVERSITY') {
        router.push('/pending');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-primary">
            Yaz Okulu Var mı?
          </Link>
          <p className="text-muted-foreground mt-2">Yeni hesap oluşturun</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card rounded-xl border border-border p-8 shadow-sm"
        >
          {error && (
            <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Rol Seçimi */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-1.5">Hesap Türü</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="STUDENT">Öğrenci</option>
              <option value="UNIVERSITY">Üniversite Yetkilisi</option>
            </select>
          </div>

          {/* .edu.tr Uyarısı */}
          {isUniversity && (
            <div className="mb-4 p-3 rounded-md bg-blue-50 border border-blue-200 text-sm text-blue-800">
              <strong>Not:</strong> Üniversite yetkilisi kaydı için kurumsal{' '}
              <code className="bg-blue-100 px-1 rounded">.edu.tr</code> uzantılı
              e-posta adresinizi kullanmanız zorunludur. Hesabınız admin onayı
              sonrası aktif olacaktır.
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium mb-1.5">
              Ad Soyad
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Adınız Soyadınız"
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
              E-posta
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={isUniversity ? 'yetkili@universite.edu.tr' : 'ornek@mail.com'}
              required
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="En az 8 karakter"
                required
                minLength={8}
                className="w-full h-10 px-3 pr-10 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-500 hover:text-slate-700 rounded"
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Üniversite Bilgileri (sadece UNIVERSITY seçildiğinde) */}
          {isUniversity && (
            <>
              <div className="mb-4">
                <label htmlFor="universityName" className="block text-sm font-medium mb-1.5">
                  Üniversite Adı *
                </label>
                <input
                  id="universityName"
                  name="universityName"
                  type="text"
                  value={formData.universityName}
                  onChange={handleChange}
                  placeholder="Örn: İstanbul Teknik Üniversitesi"
                  required
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="city" className="block text-sm font-medium mb-1.5">
                  Şehir
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Örn: İstanbul"
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors mt-2"
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
          </button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Giriş Yap
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
