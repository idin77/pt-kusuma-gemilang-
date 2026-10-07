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
    name: 'Kalkulator Estimasi Biaya & Manifest',
    badge: 'Transparan & Resmi',
    specificInquiry: 'Saya sedang mencoba Kalkulator Estimasi Biaya (Black Water Rp 500rb/m³, Grey Water Rp 900rb/m³, atau Manifest IPLT Rp 400rb/m³).'
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
 * Menghasilkan pesan WhatsApp yang sangat personal berdasarkan section dan perangkat
 */
export function generatePersonalizedWaMessage(
  sectionId: string = 'beranda',
  deviceOverride?: 'mobile' | 'desktop'
): string {
  const device = deviceOverride ? {
    isMobile: deviceOverride === 'mobile',
    deviceType: deviceOverride,
    deviceLabel: deviceOverride === 'mobile' ? 'Smartphone (Mobile)' : 'Komputer / Laptop (Desktop)',
    os: '',
    browser: ''
  } : detectDevice();

  const greeting = getFriendlyGreeting();
  const context = SECTION_CONTEXTS[sectionId] || SECTION_CONTEXTS.beranda;

  const deviceContextLine = device.isMobile
    ? '📱 *[Akses Cepat via Smartphone / Mobile]*'
    : '💻 *[Akses via Web Desktop / Laptop]*';

  const actionText = device.isMobile
    ? 'Mohon info ketersediaan armada terdekat saat ini & estimasi waktu tiba ke lokasi saya.'
    : 'Mohon info ketersediaan armada, jadwal pengerjaan, atau surat penawaran resmi untuk lokasi kami.';

  const messageLines = [
    `${greeting} Admin PT Kusuma Gemilang Raya,`,
    '',
    `Saya sedang membaca website pada bagian:`,
    `📌 *${context.name}*`,
    deviceContextLine,
    '',
    `Kebutuhan saya:`,
    `"${context.specificInquiry}"`,
    '',
    actionText,
    '',
    `Terima kasih!`
  ];

  return messageLines.join('\n');
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
  sectionId: string = 'beranda',
  source: string = 'auto_redirect_engine',
  openInNewTab: boolean = true
): void {
  const device = detectDevice();
  const message = generatePersonalizedWaMessage(sectionId, device.deviceType);
  const targetUrl = getOptimizedWhatsAppUrl(message, device.isMobile);

  // Catat event konversi
  trackConversion('whatsapp_click', source, {
    sectionId,
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
