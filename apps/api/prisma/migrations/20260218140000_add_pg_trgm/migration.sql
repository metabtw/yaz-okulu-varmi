-- pg_trgm Extension for Fuzzy Search
-- Bu migration PostgreSQL pg_trgm extension'ını aktifleştirir ve
-- Course tablosu için GIN index'leri oluşturur.
--
-- Gereksinim: PostgreSQL 14+ (pg_trgm dahili olarak desteklenir)
-- Docker ile çalışıyorsa otomatik olarak kullanılabilir.

-- Extension'ı aktifleştir
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Course.name için trigram GIN index - fuzzy arama performansı
CREATE INDEX IF NOT EXISTS idx_course_name_trgm
  ON "Course" USING GIN (name gin_trgm_ops);

-- Course.code için trigram GIN index
CREATE INDEX IF NOT EXISTS idx_course_code_trgm
  ON "Course" USING GIN (code gin_trgm_ops);

-- Test sorgusu (migration sonrası kontrol için):
-- SELECT show_trgm('matematik');
-- SELECT name, similarity(name, 'imatematik') AS score
--   FROM "Course"
--   WHERE similarity(name, 'imatematik') > 0.2
--   ORDER BY score DESC;
