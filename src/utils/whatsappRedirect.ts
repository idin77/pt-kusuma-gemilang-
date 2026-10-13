/**
 * Sistem Auto-Redirect & Personalisasi WhatsApp Cerdas
 * PT Kusuma Gemilang Raya
 * 
 * Fitur:
 * 1. Mendeteksi jenis perangkat pengunjung secara akurat (Mobile/Smartphone vs Desktop/Laptop)
 * 2. Mendeteksi bagian halaman/section yang sedang aktif dilihat oleh pengunjung
 * 3. Menyusun pesan pembuka WhatsApp yang sangat personal, ramah, dan kontekstual
 * 4. Menyediakan rute redirect otomatis (App deep-link untuk mobile / Web untuk desktop)
 */

import { CONTACT_INFO } from '../data/websiteData';
import { trackConversion } from './conversionTracker';

export interface DeviceInfo {
  isMobile: boolean;
  deviceType: 'mobile' | 'desktop';
  deviceLabel: string;
  os: string;
  browser: string;
}

export interface SectionContext {
  id: string;
  name: string;
  badge: string;
  specificInquiry: string;
}

export interface WhatsAppContext {
  sectionId?: string;
  serviceId?: string;
  serviceTitle?: string;
  sectorCategory?: string;
  district?: string;
  pricingDetails?: {
    wasteType?: string;
    volume?: number;
    withManifest?: boolean;
    ratePerCubic?: number;
    totalPrice?: number;
  };
  faqQuestion?: string;
  urgency?: 'darurat' | 'hari_ini' | 'terjadwal' | 'tanya_biaya';
  customNotes?: string;
  source?: string;
}

export const SERVICE_CONTEXT_TEMPLATES: Record<string, {
  title: string;
  category: string;
  inquiry: string;
  equipment: string;
}> = {
  'sedot-wc': {
    title: 'Sedot WC / Septic Tank (Black Water)',
    category: 'Toilet & Septic Tank',
    inquiry: 'Kloset/septic tank kami sedang penuh atau meluap dan membutuhkan penyedotan vakum tuntas bergaransi tanpa bau.',
    equipment: 'Truk Tangki Vakum Modern & Selang Panjang'
  },
  'saluran-mampet': {
    title: 'Pelancaran Saluran Mampet (Tanpa Bongkar)',
    category: 'Pipa Tersumbat',
    inquiry: 'Pipa pembuangan air/wastafel/kamar mandi kami tersumbat kotoran/lemak dan butuh penanganan mesin spiral tanpa bongkar lantai.',
    equipment: 'Mesin Rigid Spiral & Jetting Pressure'
  },
  'limbah-stp': {
    title: 'Sedot Limbah STP & Industri (Grey Water)',
    category: 'STP Komersial & Pabrik',
    inquiry: 'Kami membutuhkan penyedotan limbah cair STP pabrik/ruko komersial dengan armada tangki resmi & opsi dokumen manifest IPLT DLH.',
    equipment: 'Truk Tangki Vakum Industri & Pompa Submersible'
  },
  'pembuatan-septic-tank': {
    title: 'Pembuatan & Renovasi Septic Tank',
    category: 'Konstruksi Sanitasi',
    inquiry: 'Kami membutuhkan jasa pembuatan septic tank baru resapan SNI / biofilter modern atau renovasi tangki yang rembes/bocor.',
    equipment: 'Bahan SNI & Ahli Konstruksi Sanitasi'
  },
  'sedot-lemak': {
    title: 'Sedot Grease Trap / Lemak Dapur Resto',
    category: 'Restoran & Kuliner',
    inquiry: 'Bak kontrol grease trap resto kami penuh lemak mengeras dan butuh kuras rutin agar saluran pembuangan lancar.',
    equipment: 'Tangki Vakum & Pembersih Lemak Khusus'
  },
  'cleaning-blower': {
    title: 'Cleaning / Blower Lumpur Beku',
    category: 'Spesialis Kerak Keras',
    inquiry: 'Septic tank kami mengalami sedimentasi lumpur padat & kerak keras yang membeku, butuh blower pengencer lumpur spesialis.',
    equipment: 'Mesin Blower Pengencer & Vakum Heavy-Duty'
  }
};

export const SECTOR_CONTEXT_TEMPLATES: Record<string, {
  title: string;
  inquiry: string;
}> = {
  'Rumah Tinggal': {
    title: 'Sektor Hunian / Rumah Tinggal',
    inquiry: 'Penanganan septic tank atau WC mampet rumah tinggal dengan akses selang fleksibel (bisa masuk gang) dan pengerjaan rapi bersih.'
  },
  'Perkantoran': {
    title: 'Sektor Gedung Perkantoran',
    inquiry: 'Perawatan berkala toilet dan sistem sanitasi gedung kantor agar tidak mengganggu aktivitas kerja karyawan.'
  },
  'Perusahaan & Industri': {
    title: 'Sektor Pabrik & Kawasan Industri',
    inquiry: 'Pengangkutan limbah cair industri, SOP K3 lengkap, APD teknisi, serta penerbitan Dokumen Manifest IPLT dan faktur pajak SPPKP.'
  },
  'Usaha & Komersial': {
    title: 'Sektor Usaha, Resto, Kafe & Hotel',
    inquiry: 'Pembersihan grease trap lemak restoran dan perawatan pipa pembuangan di luar jam operasional ramai pengunjung.'
  }
};

let memoryContext: WhatsAppContext = {
  sectionId: 'beranda',
  urgency: 'hari_ini'
};

export function updateActiveContext(contextUpdates: Partial<WhatsAppContext>): WhatsAppContext {
  memoryContext = {
    ...memoryContext,
    ...contextUpdates
  };
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.setItem('pkg_wa_context', JSON.stringify(memoryContext));
    }
  } catch {
    // ignore
  }
  return memoryContext;
}

export function getActiveContext(): WhatsAppContext {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const stored = window.sessionStorage.getItem('pkg_wa_context');
      if (stored) {
        memoryContext = { ...memoryContext, ...JSON.parse(stored) };
      }
    }
  } catch {
    // ignore
  }
  return memoryContext;
}

export const SECTION_CONTEXTS: Record<string, SectionContext> = {
  beranda: {
    id: 'beranda',
    name: 'Beranda (Profil Utama)',
    badge: 'Layanan 24 Jam',
    specificInquiry: 'Saya baru saja melihat penawaran jasa sedot WC & sanitasi di beranda website PT Kusuma Gemilang Raya.'
  },
  tentang: {
    id: 'tentang',
    name: 'Tentang Kami & Keunggulan',
    badge: 'NIB 37011 & Legalitas',
    specificInquiry: 'Saya tertarik dengan keunggulan resmi PT Kusuma Gemilang Raya (NIB KBLI 37011, teknisi bersertifikat, dan jaminan bergaransi).'
  },
  layanan: {
    id: 'layanan',
    name: 'Layanan Utama Sanitasi',
    badge: 'Spesialis Vakum & Pipa',
    specificInquiry: 'Saya sedang melihat daftar Layanan Utama (Sedot WC, Saluran Pipa Mampet, Limbah STP Pabrik, atau Pembuatan Septic Tank).'
  },
  'sektor-spesialis': {
    id: 'sektor-spesialis',
    name: 'Sektor Layanan Spesialis',
    badge: 'Industri, Resto & Elit',
    specificInquiry: 'Saya sedang membaca SOP penanganan Sektor Spesialis (Pabrik Manufaktur / Hotel & Resto Grease Trap / Perumahan Cluster Mewah).'
  },
  area: {
    id: 'area',
    name: 'Peta & Wilayah Layanan Bekasi',
    badge: 'Kota & Kab. Bekasi',
    specificInquiry: 'Saya sedang mengecek peta jangkauan operasional di Kota & Kabupaten Bekasi dan ingin tahu jadwal armada terdekat ke alamat saya.'
  },
  harga: {
    id: 'harga',
    name: 'Kalkulator Estimasi Biaya & Booking Cepat',
    badge: 'Transparan & Resmi',
    specificInquiry: 'Saya sedang mencoba Kalkulator Estimasi Biaya & Booking Cepat (Black Water Rp 700rb - Rp 1,1jt/m³, Grey Water Rp 1,1jt - Rp 1,5jt/m³, Cleaning/Blower Rp 1,1jt - Rp 1,5jt/m³).'
  },
  dokumentasi: {
    id: 'dokumentasi',
    name: 'Legalitas & Kerjasama Resmi',
    badge: 'Faktur Pajak SPPKP',
    specificInquiry: 'Saya tertarik untuk konsultasi kerja sama formal, kontrak perawatan berkala, dan penerbitan faktur pajak SPPKP resmi.'
  },
  galeri: {
    id: 'galeri',
    name: 'Galeri Dokumentasi Lapangan',
    badge: 'Foto Realita Kerja',
    specificInquiry: 'Saya melihat dokumentasi foto hasil pekerjaan tim teknisi di lapangan dan ingin memesan layanan dengan standar serupa.'
  },
  testimoni: {
    id: 'testimoni',
    name: 'Ulasan & Testimoni Klien',
    badge: 'Kepuasan 100%',
    specificInquiry: 'Saya membaca testimoni positif dari pelanggan lain dan berminat menggunakan jasa sedot WC bergaransi tuntas.'
  },
  faq: {
    id: 'faq',
    name: 'Tanya Jawab (FAQ)',
    badge: 'Informasi Lengkap',
    specificInquiry: 'Saya sedang membaca FAQ seputar garansi pengerjaan tanpa bongkar dan estimasi waktu respon kedatangan armada.'
  },
  kontak: {
    id: 'kontak',
    name: 'Kontak Darurat & Pemesanan',
    badge: 'Siaga Cepat',
    specificInquiry: 'Saya ingin langsung memesan armada sedot WC darurat untuk meluncur ke lokasi saya secepatnya.'
  }
};

/**
 * Deteksi perangkat pengunjung secara komprehensif
 */
export function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      deviceType: 'desktop',
      deviceLabel: 'Desktop (Komputer/Laptop)',
      os: 'Desktop OS',
      browser: 'Web Browser'
    };
  }

  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;

  // Cek user agent mobile
  const isMobileUa = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isMobile = isMobileUa || (isTouch && isSmallScreen);

  // Deteksi OS
  let os = 'Unknown OS';
  if (/iPad|iPhone|iPod/.test(ua)) {
    os = 'iOS (Apple)';
  } else if (/Android/.test(ua)) {
    os = 'Android';
  } else if (/Windows/.test(ua)) {
    os = 'Windows';
  } else if (/Macintosh|Mac OS X/.test(ua)) {
    os = 'macOS';
  } else if (/Linux/.test(ua)) {
    os = 'Linux';
  }

  // Deteksi Browser ringkas
  let browser = 'Browser';
  if (/Chrome|CriOS/.test(ua)) browser = 'Chrome';
  else if (/Safari/.test(ua) && !/Chrome/.test(ua)) browser = 'Safari';
  else if (/Firefox|FxiOS/.test(ua)) browser = 'Firefox';
  else if (/Edge|Edg/.test(ua)) browser = 'Edge';

  return {
    isMobile,
    deviceType: isMobile ? 'mobile' : 'desktop',
    deviceLabel: isMobile ? `Smartphone (${os})` : `Komputer/Laptop (${os})`,
    os,
    browser
  };
}

/**
 * Sapaan ramah berdasarkan waktu lokal pengunjung (WIB / Local)
 */
export function getFriendlyGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

/**
 * Generator Pesan WhatsApp Cerdas Berbasis Interaksi Nyata
 * Menghasilkan template pesan terstruktur yang disesuaikan dengan layanan,
 * bagian website, kalkulator tarif, atau sektor yang sedang dilihat pengguna.
 */
export function generateIntelligentWaTemplate(
  contextParam?: WhatsAppContext,
  deviceOverride?: 'mobile' | 'desktop'
): string {
  const context = {
    ...getActiveContext(),
    ...(contextParam || {})
  };

  const device = deviceOverride ? {
    isMobile: deviceOverride === 'mobile',
    deviceType: deviceOverride,
    deviceLabel: deviceOverride === 'mobile' ? 'Smartphone (Mobile)' : 'Komputer / Laptop (Desktop)',
    os: '',
    browser: ''
  } : detectDevice();

  const greeting = getFriendlyGreeting();
  const sectionId = context.sectionId || 'beranda';
  const sectionMeta = SECTION_CONTEXTS[sectionId] || SECTION_CONTEXTS.beranda;

  // Tentukan Judul Layanan / Fokus Kebutuhan
  let topicTitle = sectionMeta.name;
  let topicInquiry = sectionMeta.specificInquiry;

  if (context.serviceId && SERVICE_CONTEXT_TEMPLATES[context.serviceId]) {
    const srv = SERVICE_CONTEXT_TEMPLATES[context.serviceId];
    topicTitle = srv.title;
    topicInquiry = srv.inquiry;
  } else if (context.serviceTitle) {
    topicTitle = context.serviceTitle;
    topicInquiry = `Saya tertarik dengan layanan ${context.serviceTitle} dan ingin konsultasi penanganan di lokasi saya.`;
  } else if (context.sectorCategory && SECTOR_CONTEXT_TEMPLATES[context.sectorCategory]) {
    const sec = SECTOR_CONTEXT_TEMPLATES[context.sectorCategory];
    topicTitle = sec.title;
    topicInquiry = sec.inquiry;
  } else if (context.faqQuestion) {
    topicTitle = 'Tanya Jawab: ' + context.faqQuestion;
    topicInquiry = `Saya sedang membaca FAQ seputar: "${context.faqQuestion}" dan ingin konfirmasi lebih detail dengan teknisi.`;
  }

  // Label Status Urgensi
  let urgencyText = '🚨 Butuh Segera / Hari Ini (Darurat)';
  if (context.urgency === 'terjadwal') {
    urgencyText = '📅 Ingin Dijadwalkan (Booking Terencana)';
  } else if (context.urgency === 'tanya_biaya') {
    urgencyText = '💰 Konsultasi Tarif & Estimasi Biaya Dahulu';
  } else if (context.urgency === 'hari_ini') {
    urgencyText = '⚡ Butuh Penanganan Hari Ini';
  }

  // Detail Tambahan jika dari Kalkulator Estimasi Biaya
  const pricingLines: string[] = [];
  const pricing = context.pricingDetails;
  if (pricing && typeof pricing.totalPrice === 'number') {
    pricingLines.push(`💵 *Simulasi Estimasi Biaya:* Rp ${pricing.totalPrice.toLocaleString('id-ID')}`);
    if (pricing.volume) pricingLines.push(`📦 *Estimasi Volume:* ${pricing.volume} Kubik (m³)`);
    if (pricing.withManifest) pricingLines.push(`📄 *Dokumen:* Dengan Dokumen Manifest Resmi IPLT (+Rp 400.000/m³)`);
  }

  const locationText = context.district ? `${context.district}, Bekasi` : 'Kota / Kabupaten Bekasi';

  const deviceHeaderTag = device.isMobile
    ? '📱 *[Akses Cepat WhatsApp Mobile]*'
    : '💻 *[Akses Web Desktop / Laptop]*';

  const lines = [
    `${greeting} *Admin PT KUSUMA GEMILANG RAYA*,`,
    '',
    `Saya menghubungi Anda melalui website resmi (*sedotwc-bekasi.com*):`,
    `📋 *Layanan / Kebutuhan:* ${topicTitle}`,
    `📍 *Wilayah Target:* ${locationText}`,
    `⏱️ *Status Urgensi:* ${urgencyText}`,
    deviceHeaderTag,
    '',
    `*Rincian Kebutuhan:*`,
    `"${topicInquiry}"`,
    ...(pricingLines.length > 0 ? ['', ...pricingLines] : []),
    ...(context.customNotes ? ['', `📝 *Catatan Tambahan:* ${context.customNotes}`] : []),
    '',
    `👉 *Mohon info:*`,
    `1. Ketersediaan armada tangki terdekat ke lokasi kami`,
    `2. Estimasi waktu tiba teknisi`,
    `3. Konfirmasi biaya & jaminan pengerjaan bergaransi`,
    '',
    `Terima kasih! Siap diarahkan.`
  ];

  return lines.join('\n');
}

/**
 * Menghasilkan pesan WhatsApp (backward-compatible)
 */
export function generatePersonalizedWaMessage(
  sectionId: string = 'beranda',
  deviceOverride?: 'mobile' | 'desktop'
): string {
  return generateIntelligentWaTemplate({ sectionId }, deviceOverride);
}

/**
 * Menghasilkan link WhatsApp yang optimal untuk jenis perangkat
 */
export function getOptimizedWhatsAppUrl(
  message: string,
  isMobileDevice?: boolean
): string {
  const isMobile = isMobileDevice !== undefined ? isMobileDevice : detectDevice().isMobile;
  const encodedText = encodeURIComponent(message);
  const rawPhone = CONTACT_INFO.phoneRaw; // 6289675064916

  // Di perangkat mobile, api.whatsapp.com/send membuka aplikasi WhatsApp secara mulus
  // tanpa hambatan layar konfirmasi tambahan
  if (isMobile) {
    return `https://api.whatsapp.com/send?phone=${rawPhone}&text=${encodedText}`;
  }

  // Di desktop, gunakan web.whatsapp.com atau api.whatsapp.com
  return `https://web.whatsapp.com/send?phone=${rawPhone}&text=${encodedText}`;
}

/**
 * Eksekusi Auto-Redirect ke WhatsApp dengan pelacakan analitik
 */
export function executeAutoRedirect(
  sectionOrContext: string | WhatsAppContext = 'beranda',
  source: string = 'auto_redirect_engine',
  openInNewTab: boolean = true
): void {
  const device = detectDevice();
  const context: WhatsAppContext = typeof sectionOrContext === 'string'
    ? { sectionId: sectionOrContext }
    : sectionOrContext;

  updateActiveContext(context);
  const message = generateIntelligentWaTemplate(context, device.deviceType);
  const targetUrl = getOptimizedWhatsAppUrl(message, device.isMobile);

  // Catat event konversi
  trackConversion('whatsapp_click', source, {
    sectionId: context.sectionId || 'beranda',
    serviceId: context.serviceId,
    serviceTitle: context.serviceTitle,
    district: context.district,
    deviceType: device.deviceType,
    deviceLabel: device.deviceLabel,
    isMobile: device.isMobile
  });

  if (openInNewTab) {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = targetUrl;
  }
}
