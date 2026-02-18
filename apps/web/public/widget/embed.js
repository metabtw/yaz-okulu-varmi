/**
 * Yaz Okulu Var mı? - Widget Embed Script
 * 
 * Üniversitelerin kendi web sitelerine gömebileceği ders tablosu widget'ı.
 * Shadow DOM kullanarak dış site CSS'inden izole çalışır.
 * 
 * Kullanım:
 * <script
 *   src="https://yazokuluvarmi.com/widget/embed.js"
 *   data-widget-id="university-slug-veya-id"
 *   data-api-url="https://api.yazokuluvarmi.com"
 *   data-theme="auto"
 *   async
 * ></script>
 * 
 * Attributes:
 * - data-widget-id (ZORUNLU): Üniversite ID veya slug
 * - data-api-url (ZORUNLU): API base URL
 * - data-theme (opsiyonel): 'light' | 'dark' | 'auto' (varsayılan: 'auto')
 */

(function() {
  'use strict';

  // Widget versiyonu
  var VERSION = '1.0.0';

  // 1. Tüm script tag'lerini bul
  var scripts = document.querySelectorAll('script[data-widget-id]');

  scripts.forEach(function(script) {
    var widgetId = script.getAttribute('data-widget-id');
    var apiUrl = script.getAttribute('data-api-url');
    var theme = script.getAttribute('data-theme') || 'auto';

    // Validasyon
    if (!widgetId) {
      console.error('[YazOkulu Widget] data-widget-id attribute zorunludur.');
      return;
    }
    if (!apiUrl) {
      console.error('[YazOkulu Widget] data-api-url attribute zorunludur.');
      return;
    }

    // 2. Container element oluştur
    var host = document.createElement('div');
    host.className = 'yaz-okulu-widget-host';
    script.parentNode.insertBefore(host, script.nextSibling);

    // 3. Shadow DOM oluştur - üniversite sitesinin CSS'ini kirletmez
    var shadow = host.attachShadow({ mode: 'open' });

    // 4. Loading state göster
    shadow.innerHTML = getLoadingHTML(theme);

    // 5. API'den veri çek
    var endpoint = apiUrl.replace(/\/+$/, '') + '/api/widget/' + encodeURIComponent(widgetId);
    
    fetch(endpoint)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('API hatası: ' + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        renderWidget(shadow, data, theme);
      })
      .catch(function(error) {
        console.error('[YazOkulu Widget] Hata:', error);
        shadow.innerHTML = getErrorHTML(error.message, theme);
      });
  });

  /**
   * Loading durumu HTML'i
   */
  function getLoadingHTML(theme) {
    var isDark = theme === 'dark' || (theme === 'auto' && prefersDarkMode());
    var textColor = isDark ? '#9ca3af' : '#6b7280';
    
    return '\
      <style>\
        .widget-loading {\
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
          padding: 24px;\
          text-align: center;\
          color: ' + textColor + ';\
        }\
        .spinner {\
          display: inline-block;\
          width: 24px;\
          height: 24px;\
          border: 3px solid ' + (isDark ? '#374151' : '#e5e7eb') + ';\
          border-top-color: #3b82f6;\
          border-radius: 50%;\
          animation: spin 1s linear infinite;\
        }\
        @keyframes spin {\
          to { transform: rotate(360deg); }\
        }\
      </style>\
      <div class="widget-loading">\
        <div class="spinner"></div>\
        <p style="margin-top: 12px;">Yükleniyor...</p>\
      </div>\
    ';
  }

  /**
   * Hata durumu HTML'i
   */
  function getErrorHTML(message, theme) {
    var isDark = theme === 'dark' || (theme === 'auto' && prefersDarkMode());
    var bgColor = isDark ? '#1f2937' : '#fef2f2';
    var textColor = isDark ? '#fca5a5' : '#dc2626';
    var borderColor = isDark ? '#374151' : '#fecaca';
    
    return '\
      <style>\
        .widget-error {\
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
          padding: 16px;\
          background: ' + bgColor + ';\
          border: 1px solid ' + borderColor + ';\
          border-radius: 8px;\
          color: ' + textColor + ';\
          text-align: center;\
        }\
      </style>\
      <div class="widget-error">\
        <p style="margin: 0;">⚠️ Widget yüklenemedi</p>\
        <p style="margin: 8px 0 0; font-size: 12px; opacity: 0.8;">' + escapeHtml(message) + '</p>\
      </div>\
    ';
  }

  /**
   * Widget'ı render et
   */
  function renderWidget(shadow, data, themePreference) {
    // Theme belirleme: API'den gelen veya kullanıcı tercihi
    var theme = themePreference;
    if (theme === 'auto') {
      theme = prefersDarkMode() ? 'dark' : 'light';
    }
    
    var isDark = theme === 'dark';
    
    // Renk paleti
    var colors = {
      bg: isDark ? '#1f2937' : '#ffffff',
      bgSecondary: isDark ? '#374151' : '#f9fafb',
      text: isDark ? '#f3f4f6' : '#111827',
      textMuted: isDark ? '#9ca3af' : '#6b7280',
      border: isDark ? '#374151' : '#e5e7eb',
      primary: '#3b82f6',
      primaryHover: '#2563eb',
      success: isDark ? '#34d399' : '#10b981',
      badge: isDark ? '#1e3a5f' : '#dbeafe'
    };

    // Tablo satırları oluştur
    var rows = data.rows || [];
    var tableRows = '';
    
    if (rows.length === 0) {
      tableRows = '\
        <tr>\
          <td colspan="6" style="text-align: center; padding: 32px; color: ' + colors.textMuted + ';">\
            Henüz ders eklenmemiş.\
          </td>\
        </tr>\
      ';
    } else {
      rows.forEach(function(course, index) {
        var rowBg = index % 2 === 0 ? colors.bg : colors.bgSecondary;
        var priceText = course.price !== null ? formatPrice(course.price, course.currency) : 'Ücretsiz';
        var onlineBadge = course.isOnline 
          ? '<span class="badge badge-online">Online</span>' 
          : '<span class="badge badge-onsite">Yüz yüze</span>';
        var applyButton = course.applicationUrl 
          ? '<a href="' + escapeHtml(course.applicationUrl) + '" target="_blank" rel="noopener" class="apply-btn">Başvur</a>'
          : '<span class="no-link">-</span>';

        tableRows += '\
          <tr style="background: ' + rowBg + ';">\
            <td class="cell-code">' + escapeHtml(course.code) + '</td>\
            <td class="cell-name">' + escapeHtml(course.name) + '</td>\
            <td class="cell-ects">' + course.ects + ' AKTS</td>\
            <td class="cell-price">' + priceText + '</td>\
            <td class="cell-type">' + onlineBadge + '</td>\
            <td class="cell-action">' + applyButton + '</td>\
          </tr>\
        ';
      });
    }

    // Ana HTML yapısı
    var html = '\
      <style>\
        * {\
          box-sizing: border-box;\
          margin: 0;\
          padding: 0;\
        }\
        .widget-container {\
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\
          background: ' + colors.bg + ';\
          color: ' + colors.text + ';\
          border: 1px solid ' + colors.border + ';\
          border-radius: 12px;\
          overflow: hidden;\
          max-width: 100%;\
        }\
        .widget-header {\
          padding: 16px 20px;\
          border-bottom: 1px solid ' + colors.border + ';\
          display: flex;\
          justify-content: space-between;\
          align-items: center;\
          flex-wrap: wrap;\
          gap: 12px;\
        }\
        .widget-title {\
          font-size: 18px;\
          font-weight: 600;\
          color: ' + colors.text + ';\
        }\
        .widget-subtitle {\
          font-size: 12px;\
          color: ' + colors.textMuted + ';\
          margin-top: 4px;\
        }\
        .widget-meta {\
          font-size: 12px;\
          color: ' + colors.textMuted + ';\
        }\
        .widget-body {\
          overflow-x: auto;\
        }\
        table {\
          width: 100%;\
          border-collapse: collapse;\
          font-size: 14px;\
        }\
        th {\
          background: ' + colors.bgSecondary + ';\
          padding: 12px 16px;\
          text-align: left;\
          font-weight: 600;\
          color: ' + colors.textMuted + ';\
          font-size: 12px;\
          text-transform: uppercase;\
          letter-spacing: 0.05em;\
          border-bottom: 1px solid ' + colors.border + ';\
          white-space: nowrap;\
        }\
        td {\
          padding: 12px 16px;\
          border-bottom: 1px solid ' + colors.border + ';\
          vertical-align: middle;\
        }\
        tr:last-child td {\
          border-bottom: none;\
        }\
        .cell-code {\
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;\
          font-size: 13px;\
          color: ' + colors.textMuted + ';\
          white-space: nowrap;\
        }\
        .cell-name {\
          font-weight: 500;\
          min-width: 200px;\
        }\
        .cell-ects, .cell-price {\
          white-space: nowrap;\
        }\
        .badge {\
          display: inline-block;\
          padding: 4px 8px;\
          border-radius: 4px;\
          font-size: 11px;\
          font-weight: 500;\
        }\
        .badge-online {\
          background: ' + (isDark ? '#065f46' : '#d1fae5') + ';\
          color: ' + (isDark ? '#6ee7b7' : '#047857') + ';\
        }\
        .badge-onsite {\
          background: ' + colors.badge + ';\
          color: ' + colors.primary + ';\
        }\
        .apply-btn {\
          display: inline-block;\
          padding: 6px 12px;\
          background: ' + colors.primary + ';\
          color: #ffffff;\
          text-decoration: none;\
          border-radius: 6px;\
          font-size: 12px;\
          font-weight: 500;\
          transition: background 0.2s;\
        }\
        .apply-btn:hover {\
          background: ' + colors.primaryHover + ';\
        }\
        .no-link {\
          color: ' + colors.textMuted + ';\
        }\
        .widget-footer {\
          padding: 12px 20px;\
          border-top: 1px solid ' + colors.border + ';\
          text-align: center;\
          font-size: 12px;\
        }\
        .widget-footer a {\
          color: ' + colors.primary + ';\
          text-decoration: none;\
        }\
        .widget-footer a:hover {\
          text-decoration: underline;\
        }\
        @media (max-width: 640px) {\
          .widget-header {\
            flex-direction: column;\
            align-items: flex-start;\
          }\
          th, td {\
            padding: 10px 12px;\
          }\
          .cell-name {\
            min-width: 150px;\
          }\
        }\
      </style>\
      <div class="widget-container">\
        <div class="widget-header">\
          <div>\
            <div class="widget-title">' + escapeHtml(data.universityName) + '</div>\
            <div class="widget-subtitle">Yaz Okulu Dersleri</div>\
          </div>\
          <div class="widget-meta">' + rows.length + ' ders</div>\
        </div>\
        <div class="widget-body">\
          <table>\
            <thead>\
              <tr>\
                <th>Kod</th>\
                <th>Ders Adı</th>\
                <th>AKTS</th>\
                <th>Ücret</th>\
                <th>Format</th>\
                <th>Başvuru</th>\
              </tr>\
            </thead>\
            <tbody>\
              ' + tableRows + '\
            </tbody>\
          </table>\
        </div>\
        <div class="widget-footer">\
          <a href="https://yazokuluvarmi.com" target="_blank" rel="noopener">\
            Tüm yaz okulu derslerini keşfet →\
          </a>\
        </div>\
      </div>\
    ';

    shadow.innerHTML = html;
  }

  /**
   * Sistem dark mode tercihini kontrol et
   */
  function prefersDarkMode() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Fiyat formatlama
   */
  function formatPrice(price, currency) {
    if (typeof price !== 'number') return String(price);
    
    var formatted = price.toLocaleString('tr-TR');
    var symbol = currency === 'TRY' ? '₺' : (currency === 'USD' ? '$' : (currency === 'EUR' ? '€' : currency));
    
    return formatted + ' ' + symbol;
  }

  /**
   * HTML escape - XSS koruması
   */
  function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    var div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  // Console'da versiyon bilgisi
  console.log('[YazOkulu Widget] v' + VERSION + ' yüklendi.');
})();
