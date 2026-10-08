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

export interface LeadData {
  id: string;
  name: string;
  phone: string;
  service: string;
  serviceName?: string;
  propertyType?: string;
  volumeEstimate?: string;
  district?: string;
  preferredSchedule?: string; // Format YYYY-MM-DD or formatted display
  preferredTimeSlot?: string; // e.g. 'Pagi (08:00 - 12:00)'
  notes?: string;
  estimatedPriceDisplay?: string;
  estimatedPrice?: number;
  timestamp: string;
  source: string;
  pageUrl: string;
  status: 'new' | 'contacted' | 'completed';
}

export interface ConversionEvent {
  id: string;
  type: 'whatsapp_click' | 'phone_call' | 'lead_submission';
  source: string; // e.g. 'hero_cta', 'mobile_floating_bar', 'price_estimator', 'header_nav', 'instant_estimate_button'
  timestamp: string;
  pageUrl: string;
  metadata?: Record<string, any>;
}

export interface ConversionSummary {
  totalWhatsAppClicks: number;
  totalPhoneCalls: number;
  totalLeadsGenerated: number;
  totalConversions: number;
  firstRecordedAt: string | null;
  lastRecordedAt: string | null;
  sourceBreakdown: Record<string, number>;
  recentEvents: ConversionEvent[];
  leads: LeadData[];
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
        totalLeadsGenerated: 0,
        totalConversions: 0,
        firstRecordedAt: null,
        lastRecordedAt: null,
        sourceBreakdown: {},
        recentEvents: [],
        leads: []
      };
    }
    const parsed = JSON.parse(raw);
    return {
      totalWhatsAppClicks: parsed.totalWhatsAppClicks || 0,
      totalPhoneCalls: parsed.totalPhoneCalls || 0,
      totalLeadsGenerated: parsed.totalLeadsGenerated || (parsed.leads ? parsed.leads.length : 0),
      totalConversions: parsed.totalConversions || 0,
      firstRecordedAt: parsed.firstRecordedAt || null,
      lastRecordedAt: parsed.lastRecordedAt || null,
      sourceBreakdown: parsed.sourceBreakdown || {},
      recentEvents: Array.isArray(parsed.recentEvents) ? parsed.recentEvents : [],
      leads: Array.isArray(parsed.leads) ? parsed.leads : []
    };
  } catch {
    return {
      totalWhatsAppClicks: 0,
      totalPhoneCalls: 0,
      totalLeadsGenerated: 0,
      totalConversions: 0,
      firstRecordedAt: null,
      lastRecordedAt: null,
      sourceBreakdown: {},
      recentEvents: [],
      leads: []
    };
  }
}

/**
 * Mengambil daftar data lead hasil lead generation form
 */
export function getStoredLeads(): LeadData[] {
  return getStoredConversions().leads;
}

/**
 * Menyimpan lead baru ke data pemasaran (Marketing Data)
 */
export function saveLeadToMarketing(leadInput: {
  name: string;
  phone: string;
  service: string;
  serviceName?: string;
  propertyType?: string;
  volumeEstimate?: string;
  district?: string;
  preferredSchedule?: string;
  preferredTimeSlot?: string;
  notes?: string;
  estimatedPriceDisplay?: string;
  estimatedPrice?: number;
  source?: string;
}): LeadData {
  const now = new Date().toISOString();
  const source = leadInput.source || 'instant_estimate_button';

  const newLead: LeadData = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: leadInput.name.trim(),
    phone: leadInput.phone.trim(),
    service: leadInput.service,
    serviceName: leadInput.serviceName || leadInput.service,
    propertyType: leadInput.propertyType,
    volumeEstimate: leadInput.volumeEstimate,
    district: leadInput.district,
    preferredSchedule: leadInput.preferredSchedule,
    preferredTimeSlot: leadInput.preferredTimeSlot,
    notes: leadInput.notes,
    estimatedPriceDisplay: leadInput.estimatedPriceDisplay,
    estimatedPrice: leadInput.estimatedPrice,
    timestamp: now,
    source,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    status: 'new'
  };

  const newConversionEvent: ConversionEvent = {
    id: `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: 'lead_submission',
    source,
    timestamp: now,
    pageUrl: typeof window !== 'undefined' ? window.location.href : '',
    metadata: {
      leadId: newLead.id,
      name: newLead.name,
      phone: newLead.phone,
      service: newLead.service,
      preferredSchedule: newLead.preferredSchedule,
      estimatedPrice: newLead.estimatedPriceDisplay
    }
  };

  // 1. Integrasi Google Tag Manager / GA4
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'generate_lead',
      conversion_type: 'lead_submission',
      conversion_source: source,
      lead_name: newLead.name,
      lead_phone: newLead.phone,
      lead_service: newLead.service,
      lead_time: now
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'Lead Generation',
        event_label: `${newLead.service} - ${newLead.name}`,
        value: newLead.estimatedPrice || 500000
      });
    }
  }

  // 2. Simpan ke Local Storage Marketing Data
  try {
    const current = getStoredConversions();
    const updatedLeads = [newLead, ...current.leads].slice(0, 100); // Simpan sampai 100 leads terbaru
    const updatedEvents = [newConversionEvent, ...current.recentEvents].slice(0, 50);

    const updated: ConversionSummary = {
      ...current,
      totalLeadsGenerated: (current.totalLeadsGenerated || 0) + 1,
      totalConversions: current.totalConversions + 1,
      firstRecordedAt: current.firstRecordedAt || now,
      lastRecordedAt: now,
      sourceBreakdown: {
        ...current.sourceBreakdown,
        [source]: (current.sourceBreakdown[source] || 0) + 1
      },
      recentEvents: updatedEvents,
      leads: updatedLeads
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event agar listener UI (seperti modal evaluasi atau badge) dapat auto-refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ptkgr_marketing_data_updated', { detail: { lead: newLead } }));
    }
  } catch (err) {
    console.debug('Error saving lead to marketing data:', err);
  }

  return newLead;
}

/**
 * Menghapus lead tertentu dari data pemasaran
 */
export function deleteStoredLead(leadId: string): void {
  try {
    const current = getStoredConversions();
    const updatedLeads = current.leads.filter(l => l.id !== leadId);
    const updated: ConversionSummary = {
      ...current,
      leads: updatedLeads,
      totalLeadsGenerated: Math.max(0, updatedLeads.length)
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ptkgr_marketing_data_updated'));
    }
  } catch (err) {
    console.debug('Error deleting lead:', err);
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
      totalLeadsGenerated: current.totalLeadsGenerated,
      totalConversions: current.totalConversions + 1,
      firstRecordedAt: current.firstRecordedAt || now,
      lastRecordedAt: now,
      sourceBreakdown: {
        ...current.sourceBreakdown,
        [source]: (current.sourceBreakdown[source] || 0) + 1
      },
      recentEvents: [newEvent, ...current.recentEvents].slice(0, 50), // Simpan 50 histori terbaru
      leads: current.leads
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
      'Total Lead Formulir': stats.totalLeadsGenerated,
      'Total Keseluruhan Konversi': stats.totalConversions,
      'Pertama Kali Tercatat': stats.firstRecordedAt || '-',
      'Terakhir Kali Tercatat': stats.lastRecordedAt || '-'
    });
    console.log('Distribusi Sumber Tombol:', stats.sourceBreakdown);
    console.log('Daftar Lead Formulir Tersimpan:', stats.leads);
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
