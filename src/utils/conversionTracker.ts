/**
 * Skrip Pelacakan Konversi Pemasaran (Marketing Conversion Analytics)
 * PT Kusuma Gemilang Raya
 * 
 * Melacak setiap interaksi konversi (WhatsApp Click, Direct Call) untuk keperluan evaluasi pemasaran.
 * Terintegrasi dengan standar:
 * 1. Google Tag Manager / GA4 (window.dataLayer & window.gtag)
 * 2. Penyimpanan analitik lokal terstruktur (localStorage) untuk evaluasi cepat
 * 3. Helper console window.__getMarketingStats()
 */

export interface ConversionEvent {
  id: string;
  type: 'whatsapp_click' | 'phone_call';
  source: string; // e.g. 'hero_cta', 'mobile_floating_bar', 'price_estimator', 'header_nav'
  timestamp: string;
  pageUrl: string;
  metadata?: Record<string, any>;
}

export interface ConversionSummary {
  totalWhatsAppClicks: number;
  totalPhoneCalls: number;
  totalConversions: number;
  firstRecordedAt: string | null;
  lastRecordedAt: string | null;
  sourceBreakdown: Record<string, number>;
  recentEvents: ConversionEvent[];
}

const STORAGE_KEY = 'ptkgr_marketing_conversions_v1';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    __getMarketingStats?: () => ConversionSummary;
    __resetMarketingStats?: () => void;
  }
}

/**
 * Mengambil ringkasan data konversi yang tersimpan di browser
 */
export function getStoredConversions(): ConversionSummary {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        totalWhatsAppClicks: 0,
        totalPhoneCalls: 0,
        totalConversions: 0,
        firstRecordedAt: null,
        lastRecordedAt: null,
        sourceBreakdown: {},
        recentEvents: []
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      totalWhatsAppClicks: 0,
      totalPhoneCalls: 0,
      totalConversions: 0,
      firstRecordedAt: null,
      lastRecordedAt: null,
      sourceBreakdown: {},
      recentEvents: []
    };
  }
}

/**
 * Melacak event konversi (WhatsApp / Phone Call)
 */
export function trackConversion(
  type: 'whatsapp_click' | 'phone_call',
  source: string,
  metadata?: Record<string, any>
): void {
  const now = new Date().toISOString();

  const newEvent: ConversionEvent = {
    id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    source,
    timestamp: now,
    pageUrl: window.location.href,
    metadata
  };

  // 1. Integrasi Google Tag Manager / Google Analytics (GA4)
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: type,
      conversion_type: type,
      conversion_source: source,
      conversion_time: now,
      ...metadata
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', type, {
        event_category: 'Lead Conversion',
        event_label: source,
        value: 1,
        ...metadata
      });
    }
  }

  // 2. Simpan ke Local Storage untuk evaluasi pemilik web
  try {
    const current = getStoredConversions();
    const isWa = type === 'whatsapp_click';
    const isCall = type === 'phone_call';

    const updated: ConversionSummary = {
      totalWhatsAppClicks: current.totalWhatsAppClicks + (isWa ? 1 : 0),
      totalPhoneCalls: current.totalPhoneCalls + (isCall ? 1 : 0),
      totalConversions: current.totalConversions + 1,
      firstRecordedAt: current.firstRecordedAt || now,
      lastRecordedAt: now,
      sourceBreakdown: {
        ...current.sourceBreakdown,
        [source]: (current.sourceBreakdown[source] || 0) + 1
      },
      recentEvents: [newEvent, ...current.recentEvents].slice(0, 50) // Simpan 50 histori terbaru
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.debug('Error saving conversion stat:', err);
  }
}

/**
 * Inisialisasi pelacak global & event listener otomatis pada seluruh tautan WA / Telp
 */
export function initConversionTracking(): void {
  if (typeof window === 'undefined') return;

  // Pasang fungsi console untuk inspeksi pemasaran
  window.__getMarketingStats = () => {
    const stats = getStoredConversions();
    console.table({
      'Total Klik WhatsApp': stats.totalWhatsAppClicks,
      'Total Telepon Langsung': stats.totalPhoneCalls,
      'Total Keseluruhan Konversi': stats.totalConversions,
      'Pertama Kali Tercatat': stats.firstRecordedAt || '-',
      'Terakhir Kali Tercatat': stats.lastRecordedAt || '-'
    });
    console.log('Distribusi Sumber Tombol:', stats.sourceBreakdown);
    console.log('50 Event Terbaru:', stats.recentEvents);
    return stats;
  };

  window.__resetMarketingStats = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.info('Data analitik konversi telah direset.');
  };

  // Global click delegate listener untuk link WhatsApp dan tel:
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement)?.closest('a');
    if (!target) return;

    const href = target.getAttribute('href') || '';
    
    if (href.includes('wa.me') || href.includes('whatsapp.com')) {
      const sourceAttr = target.getAttribute('data-cta-source') || target.id || 'general_whatsapp_link';
      trackConversion('whatsapp_click', sourceAttr, { href });
    } else if (href.startsWith('tel:')) {
      const sourceAttr = target.getAttribute('data-cta-source') || target.id || 'general_phone_link';
      trackConversion('phone_call', sourceAttr, { href });
    }
  }, { capture: true });
}
