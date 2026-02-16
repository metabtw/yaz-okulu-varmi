/**
 * SearchParserService - Jest unit testleri.
 * Türkçe doğal dil arama parser'ının doğru çalıştığını doğrular.
 */
import { Test, TestingModule } from '@nestjs/testing';
import { SearchParserService } from './search-parser.service';

describe('SearchParserService', () => {
  let parser: SearchParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchParserService],
    }).compile();
    parser = module.get<SearchParserService>(SearchParserService);
  });

  it('şehir ve online durumu doğru çıkarmalı', async () => {
    const result = await parser.parseQuery("İzmir'de online ders");
    expect(result.city).toBe('İzmir');
    expect(result.isOnline).toBe(true);
  });

  it('AKTS aralığını doğru parse etmeli', async () => {
    const result = await parser.parseQuery('3-6 kredi');
    expect(result.minEcts).toBe(3);
    expect(result.maxEcts).toBe(6);
  });

  it('tek AKTS değerini parse etmeli', async () => {
    const result = await parser.parseQuery('6 AKTS matematik');
    expect(result.minEcts).toBe(6);
    expect(result.maxEcts).toBe(6);
    expect(result.q).toContain('matematik');
  });

  it('fiyat altı/üstü ifadelerini parse etmeli', async () => {
    const alti = await parser.parseQuery('2000 TL altı');
    expect(alti.maxPrice).toBe(2000);

    const ustu = await parser.parseQuery('1500 TL üstü');
    expect(ustu.minPrice).toBe(1500);
  });

  it('fiyat aralığını parse etmeli', async () => {
    const result = await parser.parseQuery('1000-2000 TL fizik');
    expect(result.minPrice).toBe(1000);
    expect(result.maxPrice).toBe(2000);
    expect(result.q).toContain('fizik');
  });

  it('yüz yüze ifadesini parse etmeli', async () => {
    const result = await parser.parseQuery('yüz yüze programlama İstanbul');
    expect(result.isOnline).toBe(false);
    expect(result.city).toBe('İstanbul');
    expect(result.q).toContain('programlama');
  });

  it('İTÜ gibi üniversite kısaltması içeren sorguyu işlemeli', async () => {
    const result = await parser.parseQuery("İTÜ'de 2000 TL altı fizik");
    expect(result.maxPrice).toBe(2000);
    expect(result.q).toContain('fizik');
  });

  it('boş veya geçersiz girdide boş obje dönmeli', async () => {
    expect(await parser.parseQuery('')).toEqual({});
    expect(await parser.parseQuery('   ')).toEqual({});
  });
});
