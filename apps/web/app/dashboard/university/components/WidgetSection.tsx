/**
 * WidgetSection - Widget yerleştirme kodu ve ayarları.
 */
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { userApi } from '@/lib/api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export function WidgetSection() {
  const [university, setUniversity] = useState<{
    id: string;
    name: string;
    slug: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [limit, setLimit] = useState('5');
  const [sortBy, setSortBy] = useState('popular');
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    userApi
      .getMe()
      .then((me) => {
        if (me.university) {
          setUniversity({
            id: me.university.id,
            name: me.university.name,
            slug: me.university.slug,
          });
        }
      })
      .catch(console.error);
  }, []);

  const generateEmbedCode = () => {
    if (!university) return '';
    return `<!-- Yaz Okulu Widget -->
<div 
  data-yaz-okulu-widget
  data-university="${university.slug}"
  data-limit="${limit}"
  data-sort="${sortBy}"
  data-theme="${theme}"
></div>
<script src="${API_BASE}/api/widget/embed.js" async></script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    toast.success('Kod kopyalandı!');
    setTimeout(() => setCopied(false), 2000);
  };

  const widgetUrl = university
    ? `${API_BASE}/api/widget/${university.slug}?limit=${limit}&sortBy=${sortBy}`
    : '';

  if (!university) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-slate-500">
          Üniversite bilgisi yükleniyor...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Widget Ayarları</CardTitle>
            <CardDescription>Görünümü özelleştirin</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="limit">Gösterilecek Ders Sayısı</Label>
              <Input
                id="limit"
                type="number"
                min={1}
                max={10}
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Sıralama</Label>
              <div className="space-y-2">
                {[
                  { value: 'popular', label: 'Popülerlik (En çok görüntülenen)' },
                  { value: 'price', label: 'Fiyat (Ucuzdan pahalıya)' },
                  { value: 'date', label: 'Tarih (Yakın başlangıç)' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="sortBy"
                      value={opt.value}
                      checked={sortBy === opt.value}
                      onChange={() => setSortBy(opt.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tema</Label>
              <div className="space-y-2">
                {[
                  { value: 'light', label: 'Açık' },
                  { value: 'dark', label: 'Koyu' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="theme"
                      value={opt.value}
                      checked={theme === opt.value}
                      onChange={() => setTheme(opt.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Yerleştirme Kodu</CardTitle>
            <CardDescription>Bu kodu web sitenize yapıştırın</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <pre className="bg-slate-100 p-4 rounded-lg text-xs overflow-x-auto max-h-48">
                <code>{generateEmbedCode()}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Kopyalandı
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Kopyala
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2">
              <Label>API Endpoint (JSON)</Label>
              <div className="flex gap-2">
                <Input
                  value={widgetUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <a
                  href={widgetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Nasıl Kullanılır?</h4>
              <ol className="text-xs space-y-1 text-slate-600">
                <li>1. Yukarıdaki kodu kopyalayın</li>
                <li>2. Web sitenizin HTML koduna yapıştırın</li>
                <li>3. Widget otomatik olarak yüklenecektir</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
