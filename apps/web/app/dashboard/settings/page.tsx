/**
 * Profil ve Widget Ayarları Sayfası.
 * Üniversite bilgileri ve widget konfigürasyonu yönetimi.
 */
export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profil & Ayarlar</h1>

      {/* Üniversite Bilgileri */}
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Üniversite Bilgileri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Üniversite Adı</label>
            <input
              type="text"
              placeholder="Üniversite adınız"
              disabled
              className="w-full h-9 px-3 rounded-md border border-input bg-secondary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Şehir</label>
            <input
              type="text"
              placeholder="Şehir"
              disabled
              className="w-full h-9 px-3 rounded-md border border-input bg-secondary text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Web Sitesi</label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">İletişim E-postası</label>
            <input
              type="email"
              placeholder="iletisim@universite.edu.tr"
              className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
            />
          </div>
        </div>
        <button className="mt-4 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          Kaydet
        </button>
      </div>

      {/* Widget Ayarları */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold mb-4">Widget Ayarları</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Aşağıdaki kodu web sitenize ekleyerek yaz okulu ders tablonuzu sitenizde gösterebilirsiniz.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Ana Renk</label>
            <input
              type="color"
              defaultValue="#1e40af"
              className="w-full h-9 rounded-md border border-input cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Tema</label>
            <select className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm">
              <option value="light">Açık</option>
              <option value="dark">Koyu</option>
            </select>
          </div>
        </div>

        {/* Embed Kodu */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Gömme Kodu</label>
          <div className="bg-secondary rounded-md p-4 font-mono text-xs text-muted-foreground overflow-x-auto">
            {'<script src="https://yazokuluvarmi.com/widget.js" data-university-id="YOUR_ID"></script>'}
          </div>
        </div>
      </div>
    </div>
  );
}
