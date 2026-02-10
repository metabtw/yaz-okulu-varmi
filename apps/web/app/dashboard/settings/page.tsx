/**
 * Profil & Widget Ayarları Sayfası.
 * Gerçek verilerle çalışan üniversite profil yönetimi.
 * Widget nasıl çalışır rehberi + widget ayarları.
 */
'use client';

import { useEffect, useState } from 'react';
import { userApi, universityApi } from '@/lib/api';
import { Modal } from '@/components/layout/modal';
import {
  Save, Building2, Globe, Mail, Palette,
  Code, Copy, Check, Info, ExternalLink, BookOpen, CheckCircle
} from 'lucide-react';

interface UniversityData {
  id: string;
  name: string;
  slug: string;
  city: string;
  website: string | null;
  contactEmail: string | null;
  logo: string | null;
  widgetConfig: Record<string, unknown> | null;
  isVerified: boolean;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [university, setUniversity] = useState<UniversityData | null>(null);
  const [universityId, setUniversityId] = useState('');

  // Profil formu
  const [website, setWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logo, setLogo] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  // Widget formu
  const [primaryColor, setPrimaryColor] = useState('#1e40af');
  const [theme, setTheme] = useState('light');
  const [widgetSaving, setWidgetSaving] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  // Modal
  const [modal, setModal] = useState<{
    open: boolean;
    type: 'confirm' | 'error' | 'success' | 'info';
    title: string;
    message: string;
  }>({ open: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const me = await userApi.getMe();
        setUniversityId(me.universityId || '');

        if (me.university) {
          const uni = me.university as unknown as UniversityData;
          setUniversity(uni);
          setWebsite(uni.website || '');
          setContactEmail(uni.contactEmail || '');
          setLogo(uni.logo || '');

          if (uni.widgetConfig) {
            const wc = typeof uni.widgetConfig === 'string'
              ? JSON.parse(uni.widgetConfig as unknown as string)
              : uni.widgetConfig;
            setPrimaryColor((wc.primaryColor as string) || '#1e40af');
            setTheme((wc.theme as string) || 'light');
          }
        }
      } catch (err) {
        setModal({
          open: true, type: 'error',
          title: 'Profil Yüklenemedi',
          message: err instanceof Error ? err.message : 'Profil bilgileri alınamadı.',
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleProfileSave = async () => {
    if (!universityId) return;
    setProfileSaving(true);

    try {
      const data: Record<string, unknown> = {};
      if (website) data.website = website;
      if (contactEmail) data.contactEmail = contactEmail;
      if (logo) data.logo = logo;

      await universityApi.update(universityId, data);
      setModal({
        open: true, type: 'success',
        title: 'Profil Güncellendi',
        message: 'Üniversite bilgileriniz başarıyla kaydedildi.',
      });
    } catch (err) {
      setModal({
        open: true, type: 'error',
        title: 'Kaydetme Başarısız',
        message: err instanceof Error ? err.message : 'Profil bilgileri kaydedilemedi. Lütfen alanları kontrol edin.',
      });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleWidgetSave = async () => {
    if (!universityId) return;
    setWidgetSaving(true);

    try {
      await universityApi.updateWidget(universityId, { primaryColor, theme });
      setModal({
        open: true, type: 'success',
        title: 'Widget Ayarları Güncellendi',
        message: 'Widget renk ve tema ayarlarınız başarıyla kaydedildi.',
      });
    } catch (err) {
      setModal({
        open: true, type: 'error',
        title: 'Kaydetme Başarısız',
        message: err instanceof Error ? err.message : 'Widget ayarları kaydedilemedi.',
      });
    } finally {
      setWidgetSaving(false);
    }
  };

  const embedCode = `<!-- Yaz Okulu Var mı? Widget -->
<div id="yov-widget" data-university-id="${universityId}" data-color="${primaryColor}" data-theme="${theme}"></div>
<script src="https://yazokuluvarmi.com/widget.js" async></script>`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Modal */}
      <Modal
        open={modal.open}
        onClose={() => setModal((m) => ({ ...m, open: false }))}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />

      <h1 className="text-2xl font-bold text-slate-900">Profil & Ayarlar</h1>

      {/* Onay Durumu */}
      {university && (
        <div className={`rounded-2xl border p-4 flex items-center gap-3 ${
          university.isVerified
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-amber-50 border-amber-200'
        }`}>
          <CheckCircle className={`w-5 h-5 shrink-0 ${
            university.isVerified ? 'text-emerald-500' : 'text-amber-500'
          }`} />
          <p className={`text-sm font-medium ${
            university.isVerified ? 'text-emerald-700' : 'text-amber-700'
          }`}>
            {university.isVerified
              ? 'Üniversiteniz onaylı ve dersleriniz arama sonuçlarında görünüyor.'
              : 'Üniversiteniz henüz onaylanmadı. Admin onayından sonra dersleriniz görünür olacak.'}
          </p>
        </div>
      )}

      {/* ======== ÜNİVERSİTE PROFİL BİLGİLERİ ======== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Üniversite Bilgileri</h2>
            <p className="text-xs text-slate-500">Temel profil bilgilerinizi yönetin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Üniversite Adı</label>
            <input type="text" value={university?.name || ''} disabled
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">Bu alan değiştirilemez</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Şehir</label>
            <input type="text" value={university?.city || ''} disabled
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-500 cursor-not-allowed" />
            <p className="text-xs text-slate-400 mt-1">Bu alan değiştirilemez</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Globe className="w-3.5 h-3.5 inline mr-1" />Web Sitesi
            </label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.universite.edu.tr"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              <Mail className="w-3.5 h-3.5 inline mr-1" />İletişim E-postası
            </label>
            <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
              placeholder="yazokulubilgi@universite.edu.tr"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Logo URL</label>
            <input type="url" value={logo} onChange={(e) => setLogo(e.target.value)}
              placeholder="https://universite.edu.tr/logo.png"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
          </div>
        </div>

        <button onClick={handleProfileSave} disabled={profileSaving}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-400 disabled:opacity-50 transition-all shadow-sm">
          {profileSaving ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {profileSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>

      {/* ======== WİDGET NASIL ÇALIŞIR? (ÜSTTE) ======== */}
      <div className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border border-blue-100 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
            <Info className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Widget Nasıl Çalışır?</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Widget, üniversitenizin yaz okulu ders bilgilerini kendi web sitenizde
              otomatik olarak göstermenizi sağlar. Ziyaretçiler doğrudan sitenizden
              ders bilgilerine ulaşabilir.
            </p>

            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                  <Code className="w-4 h-4 text-blue-500" />
                </div>
                <h4 className="text-sm font-medium text-slate-900 mb-1">1. Kodu Kopyalayın</h4>
                <p className="text-xs text-slate-500">Aşağıdaki gömme kodunu kopyalayın.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center mb-2">
                  <ExternalLink className="w-4 h-4 text-violet-500" />
                </div>
                <h4 className="text-sm font-medium text-slate-900 mb-1">2. Sitenize Yapıştırın</h4>
                <p className="text-xs text-slate-500">HTML sayfanızın body etiketi içine ekleyin.</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                  <BookOpen className="w-4 h-4 text-emerald-500" />
                </div>
                <h4 className="text-sm font-medium text-slate-900 mb-1">3. Otomatik Güncelleme</h4>
                <p className="text-xs text-slate-500">Ders bilgileri değiştiğinde widget otomatik güncellenir.</p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-blue-100">
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Headless API Kullanımı</h4>
              <p className="text-xs text-slate-500 mb-3">
                Widget yerine kendi özel tasarımınızı kullanmak isterseniz, API endpoint&apos;imiz
                üzerinden JSON formatında ders verilerinize erişebilirsiniz:
              </p>
              <pre className="bg-slate-50 rounded-lg p-3 text-xs font-mono text-slate-600 overflow-x-auto">
{`fetch("https://yazokuluvarmi.com/api/widget/${universityId}")
  .then(res => res.json())
  .then(data => {
    // data.courses - Ders listesi
    // data.university - Üniversite bilgileri
    console.log(data);
  });`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* ======== WİDGET AYARLARI (ALTTA) ======== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
            <Palette className="w-5 h-5 text-violet-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Widget Ayarları</h2>
            <p className="text-xs text-slate-500">Ders tablonuzu web sitenize gömün</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Ana Renk</label>
            <div className="flex items-center gap-3">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Tema</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
              <option value="light">Açık Tema</option>
              <option value="dark">Koyu Tema</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleWidgetSave} disabled={widgetSaving}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-violet-500 text-white text-sm font-medium hover:bg-violet-400 disabled:opacity-50 transition-all shadow-sm">
            {widgetSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {widgetSaving ? 'Kaydediliyor...' : 'Widget Ayarlarını Kaydet'}
          </button>
        </div>

        {/* Gömme Kodu */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
              <Code className="w-4 h-4" />Gömme Kodu (Embed)
            </label>
            <button onClick={() => copyToClipboard(embedCode)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-blue-500 hover:bg-blue-50 transition-all">
              {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {codeCopied ? 'Kopyalandı!' : 'Kopyala'}
            </button>
          </div>
          <pre className="bg-slate-900 text-slate-300 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">
            {embedCode}
          </pre>
        </div>

        {/* API Endpoint */}
        <div>
          <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-2">
            <Globe className="w-4 h-4" />API Endpoint (Headless)
          </label>
          <div className="bg-slate-50 rounded-xl p-4 text-xs font-mono text-slate-600 border border-slate-200">
            GET https://yazokuluvarmi.com/api/widget/{universityId}
          </div>
        </div>
      </div>
    </div>
  );
}
