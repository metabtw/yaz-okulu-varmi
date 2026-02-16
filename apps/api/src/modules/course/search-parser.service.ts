/**
 * SearchParserService - Kural tabanlı Türkçe doğal dil arama parser'ı.
 * Regex ve string matching ile sorguyu filtre parametrelerine çevirir.
 * Örnek: "İzmir'de online matematik" -> { city: 'İzmir', isOnline: true, q: 'matematik' }
 */
import { Injectable } from '@nestjs/common';

/** Parser çıktısı - CourseFilterDto ile uyumlu */
export interface ParsedSearchFilters {
  q?: string;
  city?: string;
  isOnline?: boolean;
  minEcts?: number;
  maxEcts?: number;
  minPrice?: number;
  maxPrice?: number;
}

/** Türkiye'nin 81 ili - normalize key -> canonical value */
const TURKISH_CITIES: [string, string][] = [
  ['adana', 'Adana'],
  ['adiyaman', 'Adıyaman'],
  ['afyon', 'Afyonkarahisar'],
  ['afyonkarahisar', 'Afyonkarahisar'],
  ['agri', 'Ağrı'],
  ['aksaray', 'Aksaray'],
  ['amasya', 'Amasya'],
  ['ankara', 'Ankara'],
  ['antalya', 'Antalya'],
  ['ardahan', 'Ardahan'],
  ['artvin', 'Artvin'],
  ['aydin', 'Aydın'],
  ['balikesir', 'Balıkesir'],
  ['bartin', 'Bartın'],
  ['batman', 'Batman'],
  ['bayburt', 'Bayburt'],
  ['bilecik', 'Bilecik'],
  ['bingol', 'Bingöl'],
  ['bitlis', 'Bitlis'],
  ['bolu', 'Bolu'],
  ['burdur', 'Burdur'],
  ['bursa', 'Bursa'],
  ['canakkale', 'Çanakkale'],
  ['cankiri', 'Çankırı'],
  ['corum', 'Çorum'],
  ['denizli', 'Denizli'],
  ['diyarbakir', 'Diyarbakır'],
  ['duzce', 'Düzce'],
  ['edirne', 'Edirne'],
  ['elazig', 'Elazığ'],
  ['erzincan', 'Erzincan'],
  ['erzurum', 'Erzurum'],
  ['eskisehir', 'Eskişehir'],
  ['gaziantep', 'Gaziantep'],
  ['giresun', 'Giresun'],
  ['gumushane', 'Gümüşhane'],
  ['hakkari', 'Hakkâri'],
  ['hatay', 'Hatay'],
  ['igdir', 'Iğdır'],
  ['isparta', 'Isparta'],
  ['istanbul', 'İstanbul'],
  ['izmir', 'İzmir'],
  ['kahramanmaras', 'Kahramanmaraş'],
  ['karabuk', 'Karabük'],
  ['karaman', 'Karaman'],
  ['kars', 'Kars'],
  ['kastamonu', 'Kastamonu'],
  ['kayseri', 'Kayseri'],
  ['kilis', 'Kilis'],
  ['kirikkale', 'Kırıkkale'],
  ['kirklareli', 'Kırklareli'],
  ['kirsehir', 'Kırşehir'],
  ['kocaeli', 'Kocaeli'],
  ['konya', 'Konya'],
  ['kutahya', 'Kütahya'],
  ['malatya', 'Malatya'],
  ['manisa', 'Manisa'],
  ['mardin', 'Mardin'],
  ['mersin', 'Mersin'],
  ['mugla', 'Muğla'],
  ['mus', 'Muş'],
  ['nevsehir', 'Nevşehir'],
  ['nigde', 'Niğde'],
  ['ordu', 'Ordu'],
  ['osmaniye', 'Osmaniye'],
  ['rize', 'Rize'],
  ['sakarya', 'Sakarya'],
  ['samsun', 'Samsun'],
  ['siirt', 'Siirt'],
  ['sinop', 'Sinop'],
  ['sivas', 'Sivas'],
  ['sanliurfa', 'Şanlıurfa'],
  ['sirnak', 'Şırnak'],
  ['tekirdag', 'Tekirdağ'],
  ['tokat', 'Tokat'],
  ['trabzon', 'Trabzon'],
  ['tunceli', 'Tunceli'],
  ['usak', 'Uşak'],
  ['van', 'Van'],
  ['yalova', 'Yalova'],
  ['yozgat', 'Yozgat'],
  ['zonguldak', 'Zonguldak'],
];

@Injectable()
export class SearchParserService {
  private readonly turkishCities = new Map<string, string>(
    TURKISH_CITIES.map(([k, v]) => [k, v]),
  );

  /**
   * Doğal dil sorgusunu filtre parametrelerine çevirir.
   * @param query - Kullanıcı girişi (örn: "İzmir'de online matematik")
   * @returns ParsedSearchFilters - API filtreleri
   */
  async parseQuery(query: string): Promise<ParsedSearchFilters> {
    if (!query || typeof query !== 'string') {
      return {};
    }

    const normalized = this.normalizeTurkish(query);
    const result: ParsedSearchFilters = {};

    // 1. Şehir çıkar
    result.city = this.extractCity(normalized);

    // 2. AKTS çıkar
    const ects = this.extractEcts(normalized);
    result.minEcts = ects.min;
    result.maxEcts = ects.max;

    // 3. Fiyat çıkar
    const price = this.extractPrice(normalized);
    result.minPrice = price.min;
    result.maxPrice = price.max;

    // 4. Online / yüz yüze
    result.isOnline = this.extractOnlineStatus(normalized);

    // 5. Ders adı (kalan metin)
    result.q = this.extractCourseName(normalized, result);

    return result;
  }

  /** Türkçe karakterleri ASCII'ye çevir (case-insensitive arama için) */
  private normalizeTurkish(text: string): string {
    // Türkçe İ (U+0130) ve I (U+0049) locale'den bağımsız işle
    let t = text.replace(/\u0130/g, 'i').replace(/\u0131/g, 'i');
    t = t.replace(/\u0049/g, 'i'); // ASCII I -> i (Istanbul -> istanbul)
    const lower = t.toLowerCase().trim();
    const map: Record<string, string> = {
      'ı': 'i', 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ö': 'o', 'ç': 'c',
      'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c',
      'â': 'a', 'î': 'i', 'û': 'u',
    };
    return lower
      .split('')
      .map((c) => map[c] ?? c)
      .join('');
  }

  /** Şehir adını metinden çıkar - 81 il destekli */
  private extractCity(normalized: string): string | undefined {
    for (const [key, value] of this.turkishCities) {
      // Kelime sınırı: boşluk, apostrof, tire veya string başı/sonu
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, 'i');
      if (pattern.test(normalized)) {
        return value;
      }
    }
    return undefined;
  }

  /** AKTS / kredi aralığını çıkar */
  private extractEcts(
    normalized: string,
  ): { min?: number; max?: number } {
    // "3-6 kredi", "6 AKTS", "4 ects" vb.
    const rangeMatch = normalized.match(/(\d+)\s*[-–]\s*(\d+)\s*(akts|kredi|ects)?/i);
    if (rangeMatch) {
      const min = parseInt(rangeMatch[1], 10);
      const max = parseInt(rangeMatch[2], 10);
      return { min: Math.min(min, max), max: Math.max(min, max) };
    }

    const singleMatch = normalized.match(/(\d+)\s*(akts|kredi|ects)/i);
    if (singleMatch) {
      const val = parseInt(singleMatch[1], 10);
      return { min: val, max: val };
    }

    return {};
  }

  /** Fiyat aralığını çıkar (TL, lira, ₺) */
  private extractPrice(
    normalized: string,
  ): { min?: number; max?: number } {
    // "2000 TL altı" -> maxPrice: 2000
    const altiMatch = normalized.match(/(\d+)\s*(tl|lira|₺)?\s*alt[iı]/i);
    if (altiMatch) {
      return { max: parseInt(altiMatch[1], 10) };
    }

    // "1500 TL üstü" -> minPrice: 1500
    const ustuMatch = normalized.match(/(\d+)\s*(tl|lira|₺)?\s*(ustu|üstü)/i);
    if (ustuMatch) {
      return { min: parseInt(ustuMatch[1], 10) };
    }

    // "1000-2000 TL" -> min: 1000, max: 2000
    const rangeMatch = normalized.match(/(\d+)\s*[-–]\s*(\d+)\s*(tl|lira|₺)?/i);
    if (rangeMatch) {
      const a = parseInt(rangeMatch[1], 10);
      const b = parseInt(rangeMatch[2], 10);
      return { min: Math.min(a, b), max: Math.max(a, b) };
    }

    return {};
  }

  /** Online / yüz yüze durumunu çıkar */
  private extractOnlineStatus(normalized: string): boolean | undefined {
    const onlineKeywords = ['online', 'uzaktan', 'cevrimici', 'dijital', 'uzaktan egitim'];
    const offlineKeywords = ['yuz yuze', 'yuzyuze', 'kampuste', 'yerinde', 'fiziksel'];

    for (const kw of onlineKeywords) {
      if (normalized.includes(kw)) return true;
    }
    for (const kw of offlineKeywords) {
      if (normalized.includes(kw)) return false;
    }
    return undefined;
  }

  /**
   * Ders adını çıkar - şehir, AKTS, fiyat, online anahtar kelimelerini çıkar, kalanı döndür.
   */
  private extractCourseName(
    normalized: string,
    extracted: ParsedSearchFilters,
  ): string | undefined {
    let remaining = normalized;

    // Şehir kelimesini çıkar
    if (extracted.city) {
      const cityKey = [...this.turkishCities.entries()].find(
        ([, v]) => v === extracted.city,
      )?.[0];
      if (cityKey) {
        remaining = remaining.replace(new RegExp(cityKey + "'?de?", 'gi'), ' ');
      }
    }

    // AKTS / kredi ifadelerini çıkar
    remaining = remaining.replace(/(\d+)\s*[-–]\s*(\d+)\s*(akts|kredi|ects)?/gi, ' ');
    remaining = remaining.replace(/(\d+)\s*(akts|kredi|ects)/gi, ' ');

    // Fiyat ifadelerini çıkar
    remaining = remaining.replace(/(\d+)\s*(tl|lira|₺)?\s*alt[iı]/gi, ' ');
    remaining = remaining.replace(/(\d+)\s*(tl|lira|₺)?\s*(ustu|üstü)/gi, ' ');
    remaining = remaining.replace(/(\d+)\s*[-–]\s*(\d+)\s*(tl|lira|₺)?/gi, ' ');

    // Online / yüz yüze kelimelerini çıkar (normalize edilmiş metinde aranır)
    const stopWords = [
      'online', 'uzaktan', 'cevrimici', 'dijital',
      'yuz yuze', 'yuzyuze', 'kampuste', 'yerinde', 'fiziksel',
      'ders', 'dersi', 'dersler', 'dersleri', 'de', 'da', 'te', 'ta',
    ];
    for (const w of stopWords) {
      remaining = remaining.replace(new RegExp(`\\b${w}\\b`, 'gi'), ' ');
    }

    const cleaned = remaining.replace(/\s+/g, ' ').trim();
    if (cleaned.length >= 2) {
      return cleaned;
    }
    return undefined;
  }
}
