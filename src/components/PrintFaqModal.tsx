import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  Printer, 
  X, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock,
  BadgeCheck,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  QrCode as QrCodeIcon,
  MessageCircle,
  Fingerprint,
  AlertCircle,
  ListOrdered,
  Scan,
  ArrowDown,
  ArrowLeft,
  Camera,
  HelpCircle,
  FileSpreadsheet,
  Share2,
  Mail,
  Send,
  Twitter
} from 'lucide-react';
import { FaqItem, CONTACT_INFO } from '../data/websiteData';
import { exportFaqsToCsv } from '../utils/exportCsv';

interface PrintFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  faqs: FaqItem[];
  activeCategory: string;
  searchQuery: string;
  totalFaqsCount: number;
}

export default function PrintFaqModal({
  isOpen,
  onClose,
  faqs,
  activeCategory,
  searchQuery,
  totalFaqsCount
}: PrintFaqModalProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [totalPages, setTotalPages] = useState<number>(1);
  const printableAreaRef = useRef<HTMLDivElement>(null);

  // Measure content height and calculate dynamic total A4 pages for multi-page exports
  useEffect(() => {
    if (!isOpen) return;

    const calculatePages = () => {
      if (printableAreaRef.current) {
        // Standard A4 page usable content height in browser print is ~940px
        const scrollHeight = printableAreaRef.current.scrollHeight;
        const estimated = Math.max(1, Math.ceil(scrollHeight / 940));
        setTotalPages(estimated);
      }
    };

    calculatePages();
    const timer1 = setTimeout(calculatePages, 250);
    const timer2 = setTimeout(calculatePages, 600);

    window.addEventListener('resize', calculatePages);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', calculatePages);
    };
  }, [isOpen, faqs.length, activeCategory, searchQuery, qrCodeDataUrl]);

  // Fixed document metadata for consistent printable output
  const [docMeta] = useState(() => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const timeFormatted = now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) + ' WIB';
    const pad = (n: number) => String(n).padStart(2, '0');
    const docRef = `KGR/FAQ-DOC/${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
    const isoTimestamp = now.toISOString();
    const lastUpdated = `${now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}, ${now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })} WIB`;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const documentId = `ID: KGR-FAQ-${now.getFullYear()}-${randomSuffix}`;
    const generatedOn = `${now.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })}, ${now.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })} WIB`;

    return {
      dateFormatted,
      timeFormatted,
      docRef,
      isoTimestamp,
      lastUpdated,
      documentId,
      generatedOn
    };
  });

  // Calculate unique categories, counts, and question number ranges for Daftar Isi
  const exportCategories = React.useMemo(() => {
    const catsMap = new Map<string, { count: number; firstIndex: number }>();
    faqs.forEach((faq, index) => {
      const cat = faq.category || 'Umum';
      if (!catsMap.has(cat)) {
        catsMap.set(cat, { count: 1, firstIndex: index + 1 });
      } else {
        const existing = catsMap.get(cat)!;
        existing.count += 1;
      }
    });
    return Array.from(catsMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      firstIndex: data.firstIndex,
      lastIndex: data.firstIndex + data.count - 1,
      slug: `faq-cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    }));
  }, [faqs]);

  const bookingWhatsAppUrl = `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent('Halo PT Kusuma Gemilang Raya, saya membaca Dokumen Cetak FAQ Resmi dan ingin booking / konsultasi layanan sanitasi.')}`;

  useEffect(() => {
    QRCode.toDataURL(bookingWhatsAppUrl, {
      width: 256,
      margin: 1,
      color: {
        dark: '#0A192F',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    }).then(url => {
      setQrCodeDataUrl(url);
    }).catch(err => {
      console.error('Gagal generate QR Code:', err);
    });
  }, [bookingWhatsAppUrl]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAllText = () => {
    const textLines = [
      '==============================================================',
      'PT KUSUMA GEMILANG RAYA - DOKUMEN REFERENSI RESMI FAQ',
      `Generated on: ${docMeta.generatedOn} (Live Service Snapshot)`,
      'Status: LEGAL & LICENSED (NIB: 3701100028193 • IPLT Sumur Batu)',
      'Jasa Sedot WC, Pembersihan Saluran & Penanganan Limbah Resmi Bekasi',
      `Tanggal Terbit: ${docMeta.dateFormatted}`,
      `Waktu & Timestamp: ${docMeta.timeFormatted}`,
      `Nomor Referensi: ${docMeta.docRef}`,
      `Document ID: ${docMeta.documentId}`,
      `Filter Kategori: ${activeCategory}`,
      searchQuery ? `Kata Kunci Pencarian: "${searchQuery}"` : '',
      `Total Pertanyaan: ${faqs.length}`,
      '==============================================================\n'
    ].filter(Boolean);

    if (exportCategories.length > 0) {
      textLines.push('DAFTAR ISI (TABEL KATEGORI):');
      exportCategories.forEach((cat, idx) => {
        textLines.push(`  ${idx + 1}. ${cat.name} (${cat.count} Butir, No. ${cat.firstIndex} - ${cat.lastIndex})`);
      });
      textLines.push('--------------------------------------------------------------\n');
    }

    faqs.forEach((item, index) => {
      textLines.push(`${index + 1}. [${item.category || 'FAQ'}] ${item.q}`);
      textLines.push(`   Jawaban: ${item.a}`);
      if (item.badge) {
        textLines.push(`   Status: Terverifikasi (${item.badge})`);
      }
      textLines.push('');
    });

    textLines.push('--------------------------------------------------------------');
    textLines.push(`Kanal WhatsApp Resmi: ${CONTACT_INFO.phoneDisplay} (${bookingWhatsAppUrl})`);
    textLines.push(`Wilayah Operasional: ${CONTACT_INFO.legal.serviceArea}`);
    textLines.push('PRINT DISCLAIMER: Dokumen cetak ini diterbitkan untuk tujuan informasi umum & pedoman teknis operasional.');
    textLines.push('Untuk pembuktian hukum resmi & klaim garansi yang sah, pelanggan wajib menyertakan Invoice / Kwitansi Resmi berstempel basah PT Kusuma Gemilang Raya beserta Manifest Limbah IPLT resmi.');
    textLines.push('Dokumen diterbitkan secara sah untuk keperluan referensi profesional pelanggan.');

    navigator.clipboard.writeText(textLines.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    });
  };

  // State to track which FAQ item has its Quick Share menu opened
  const [activeShareMenuId, setActiveShareMenuId] = useState<string | null>(null);
  const [copiedShareFaqId, setCopiedShareFaqId] = useState<string | null>(null);

  // Close share popup on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.faq-share-container')) {
        setActiveShareMenuId(null);
      }
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleShareWhatsApp = (faq: FaqItem, index: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sedotwcbekasi.co.id';
    const faqAnchor = `${origin}/#faq-${faq.id || (index + 1)}`;
    const text = `*Tanya Jawab Sanitasi PT Kusuma Gemilang Raya*\n\n*Q:* ${faq.q}\n\n*A:* ${faq.a}\n\nBuka FAQ lengkap: ${faqAnchor}\n\nHotline 24 Jam: ${CONTACT_INFO.phoneDisplay}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setActiveShareMenuId(null);
  };

  const handleShareTwitter = (faq: FaqItem, index: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sedotwcbekasi.co.id';
    const faqAnchor = `${origin}/#faq-${faq.id || (index + 1)}`;
    const text = `FAQ Sanitasi PT Kusuma Gemilang Raya:\n"${faq.q}"\n\nPelajari selengkapnya:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(faqAnchor)}`, '_blank', 'noopener,noreferrer');
    setActiveShareMenuId(null);
  };

  const handleShareEmail = (faq: FaqItem, index: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sedotwcbekasi.co.id';
    const faqAnchor = `${origin}/#faq-${faq.id || (index + 1)}`;
    const subject = `FAQ Sanitasi: ${faq.q} - PT Kusuma Gemilang Raya`;
    const body = `Halo,\n\nBerikut ringkasan tanya jawab resmi dari PT Kusuma Gemilang Raya:\n\nPertanyaan:\n${faq.q}\n\nPenjelasan Resmi:\n${faq.a}\n\nTautan Resmi: ${faqAnchor}\nHotline 24 Jam: ${CONTACT_INFO.phoneDisplay}\nLegalitas: NIB KBLI 37011 • IPLT Sumur Batu\n\nPT Kusuma Gemilang Raya`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setActiveShareMenuId(null);
  };

  const handleCopyFaqDirectText = (faq: FaqItem, index: number) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sedotwcbekasi.co.id';
    const faqAnchor = `${origin}/#faq-${faq.id || (index + 1)}`;
    const text = `[FAQ PT Kusuma Gemilang Raya]\nQ: ${faq.q}\nA: ${faq.a}\nRef: ${faqAnchor}`;
    navigator.clipboard.writeText(text).then(() => {
      const idKey = String(faq.id || index + 1);
      setCopiedShareFaqId(idKey);
      setTimeout(() => setCopiedShareFaqId(null), 2000);
      setActiveShareMenuId(null);
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      {/* Container Dialog */}
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Toolbar (Screen only - hidden when printing) */}
        <div className="no-print p-4 sm:p-5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C2CB]/20 text-[#00C2CB] flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white leading-tight">
                Dokumen Cetak FAQ Resmi
              </h3>
              <p className="text-xs text-slate-400">
                Format resmi ramah cetak (A4 / PDF) dengan Header Timestamp, Stempel Perusahaan & QR Code Pemesanan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy All Text Button */}
            <button
              type="button"
              onClick={handleCopyAllText}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              title="Salin seluruh pertanyaan & jawaban sebagai teks"
            >
              {copiedAll ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Teks Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Teks</span>
                </>
              )}
            </button>

            {/* Export to CSV Button */}
            <button
              type="button"
              onClick={() => exportFaqsToCsv(faqs, {
                activeCategory,
                searchQuery
              })}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-emerald-950 text-slate-200 hover:text-emerald-300 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700 hover:border-emerald-500/50"
              title="Unduh seluruh data FAQ sebagai file tabel CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </button>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#E65F00] text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md cursor-pointer hover:shadow-orange-500/20"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Tutup pratinjau cetak"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner in Modal Header */}
        <div className="no-print bg-amber-50 px-5 py-2.5 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold">Filter Aktif:</span>
            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
              Kategori: {activeCategory}
            </span>
            {searchQuery && (
              <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                Pencarian: "{searchQuery}"
              </span>
            )}
            <span className="text-amber-700">
              • Menampilkan {faqs.length} dari {totalFaqsCount} FAQ
            </span>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
              <span>📄 Total Dokumen: {totalPages} Halaman (A4)</span>
            </span>
          </div>
          <span className="hidden sm:inline text-amber-700/80 italic text-[11px]">
            Tip: Dokumen dilengkapi penomoran halaman dinamis, Stempel Resmi & QR Code.
          </span>
        </div>

        {/* Printable Document Sheet */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-slate-100 flex-1">
          <div 
            id="faq-printable-area" 
            ref={printableAreaRef}
            className="relative overflow-hidden max-w-3xl mx-auto bg-white p-6 sm:p-12 rounded-2xl shadow-md border border-slate-200 text-slate-800 font-sans print:shadow-none print:border-none print:p-0 print:overflow-visible"
          >
            {/* SUBTLE 'DRAFT' WATERMARK OVERLAY ACROSS THE ENTIRE PRINTABLE AREA */}
            <div 
              id="faq-print-draft-watermark"
              aria-hidden="true"
              className="faq-watermark-overlay pointer-events-none select-none absolute inset-0 z-0 overflow-hidden flex flex-col justify-around items-center"
            >
              {/* Seamless repeating diagonal DRAFT watermark pattern */}
              <svg 
                className="absolute inset-0 w-full h-full opacity-[0.035] print:opacity-[0.05]" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern 
                    id="draft-watermark-pattern" 
                    width="380" 
                    height="240" 
                    patternUnits="userSpaceOnUse" 
                    patternTransform="rotate(-30 60 60)"
                  >
                    <text 
                      x="30" 
                      y="95" 
                      fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" 
                      fontSize="54" 
                      fontWeight="900" 
                      letterSpacing="12" 
                      fill="#0f172a"
                    >
                      DRAFT
                    </text>
                    <text 
                      x="32" 
                      y="128" 
                      fontFamily="ui-sans-serif, system-ui, -apple-system, sans-serif" 
                      fontSize="10" 
                      fontWeight="800" 
                      letterSpacing="4" 
                      fill="#334155"
                    >
                      PT KUSUMA GEMILANG RAYA • FAQ
                    </text>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#draft-watermark-pattern)" />
              </svg>

              {/* Diagonal prominent yet subtle 'DRAFT' stamps across document height */}
              <div className="relative w-full h-full flex flex-col justify-around items-center py-16 gap-36">
                {[...Array(6)].map((_, idx) => (
                  <div
                    key={idx}
                    className="transform -rotate-[32deg] text-center whitespace-nowrap opacity-[0.035] print:opacity-[0.055]"
                  >
                    <div className="inline-flex flex-col items-center border-[3.5px] border-dashed border-slate-700/80 px-10 py-3.5 rounded-2xl tracking-[0.3em] font-black uppercase shadow-xs">
                      <span className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-[0.25em]">
                        DRAFT
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-[10px] sm:text-xs font-black tracking-[0.35em] text-slate-800">
                        <span>PT KUSUMA GEMILANG RAYA</span>
                        <span>•</span>
                        <span>INFORMATIONAL COPY</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Content - relative z-10 for sharp readability over watermark */}
            <div className="relative z-10">
              {/* TOP CENTERED OFFICIAL LOGO OF PT KUSUMA GEMILANG RAYA (OPTIMIZED FOR A4 PRINT) */}
              <div 
                id="faq-print-official-logo"
                className="flex flex-col items-center justify-center mb-4 text-center break-inside-avoid print:break-inside-avoid"
              >
                {/* High-Quality Centered Logo Box for A4 Print */}
                <div className="relative inline-flex items-center justify-center p-1.5 sm:p-2 bg-white rounded-2xl border-2 border-[#0A192F] print:border-black shadow-xs print:shadow-none">
                  <img
                    src={CONTACT_INFO.logoUrl}
                    alt="Logo Resmi PT Kusuma Gemilang Raya"
                    className="w-20 h-20 sm:w-24 sm:h-24 print:w-20 print:h-20 object-contain rounded-xl"
                    loading="eager"
                    decoding="sync"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Official Letterhead Subtitle Under Logo */}
                <div className="mt-2 flex flex-col items-center gap-0.5">
                  <span className="text-xs sm:text-sm font-black tracking-widest uppercase text-[#0A192F] print:text-black">
                    PT KUSUMA GEMILANG RAYA
                  </span>
                  <div className="flex items-center gap-1.5 text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.2em] uppercase text-slate-600 print:text-slate-800">
                    <span>BADAN USAHA SANITASI RESMI</span>
                    <span>•</span>
                    <span>KOTA & KABUPATEN BEKASI</span>
                  </div>
                </div>
              </div>

              {/* TOP 'GENERATED ON' LIVE SNAPSHOT DATE STAMP */}
              <div 
                id="faq-generated-on-stamp"
                className="mb-3.5 px-3.5 py-2 bg-slate-50 print:bg-white rounded-xl border border-slate-300 print:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs print:shadow-none break-inside-avoid"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-slate-800 print:text-black">
                    <Clock className="w-3.5 h-3.5 text-emerald-600 print:text-black shrink-0" />
                    <span className="uppercase text-[10px] tracking-wider text-slate-600 print:text-slate-700 font-extrabold">Generated on:</span>
                    <span className="font-bold text-[#0A192F] print:text-black font-mono text-[11px] bg-white print:bg-transparent px-2 py-0.5 rounded border border-slate-200 print:border-none shadow-2xs print:shadow-none">
                      {docMeta.generatedOn}
                    </span>
                  </span>
                  <span className="text-slate-300 print:text-slate-400">•</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 print:text-slate-700 bg-emerald-50 print:bg-slate-100 px-2 py-0.5 rounded-full border border-emerald-200 print:border-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse print:hidden" />
                    Live Snapshot Informasi Layanan
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 print:text-slate-600">
                  <span className="hidden sm:inline">REF:</span>
                  <span className="font-bold text-slate-700 print:text-black">{docMeta.docRef}</span>
                </div>
              </div>

              {/* TOP OFFICIAL DOCUMENT TITLE */}
              <h1 
                id="faq-document-title"
                className="text-center font-black text-xl sm:text-2xl text-[#0A192F] uppercase tracking-wide mb-3 pb-2.5 border-b border-slate-300 print:border-slate-800 print:text-black break-inside-avoid"
              >
                FAQ Layanan Sanitasi - PT Kusuma Gemilang Raya
              </h1>

              {/* Header Surat Resmi PT Kusuma Gemilang Raya with Complete Company Contact Details */}
              <header 
                id="faq-main-header" 
                className="border-b-2 border-slate-900 pb-5 mb-5 break-inside-avoid"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight uppercase">
                        PT KUSUMA GEMILANG RAYA
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300 print:border print:border-emerald-700">
                        LEGAL & RESMI IPLT
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-bold mt-1">
                      FAQ Layanan Sanitasi • Panduan Standar Pelayanan & Teknis Pengurasan Limbah
                    </p>
                    <p className="text-[11.5px] text-slate-600 mt-0.5 font-medium">
                      Spesialis Jasa Sanitasi, Pengurasan Septic Tank & Penanganan Limbah Cair Industri Berizin
                    </p>

                    {/* Complete Company Contact Details */}
                    <div 
                      id="faq-company-contact-details" 
                      className="mt-2.5 pt-2 border-t border-slate-200 print:border-slate-400 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600 print:text-slate-900"
                    >
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-600 print:text-black shrink-0" />
                        <span><strong>Hotline 24 Jam:</strong> {CONTACT_INFO.phoneDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600 print:text-black shrink-0" />
                        <span><strong>WhatsApp CS:</strong> {CONTACT_INFO.phoneDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 print:text-black shrink-0" />
                        <span><strong>Wilayah Layanan:</strong> {CONTACT_INFO.legal.serviceArea}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-600 print:text-black shrink-0" />
                        <span><strong>Jam Operasional:</strong> {CONTACT_INFO.legal.operationalHours}</span>
                      </div>
                      <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2 text-[10.5px] text-slate-500 print:text-slate-700 mt-0.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 print:text-black shrink-0" />
                        <span><strong>Legalitas:</strong> {CONTACT_INFO.legal.nib} • {CONTACT_INFO.legal.cert} • {CONTACT_INFO.legal.tax}</span>
                      </div>
                    </div>
                  </div>

                  {/* PROMINENT OFFICIAL 'LEGAL & LICENSED' CIRCULAR SEAL */}
                  <div 
                    id="faq-legal-licensed-seal"
                    className="shrink-0 self-start sm:self-center flex items-center justify-center select-none"
                    title="Segel Resmi Terverifikasi: Legal & Licensed Sanitation Enterprise"
                  >
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#0A192F] p-1 flex items-center justify-center text-center bg-gradient-to-br from-amber-50 to-emerald-50/50 print:bg-white print:border-black shadow-xs">
                      <div className="w-full h-full rounded-full border border-dashed border-amber-800 print:border-black flex flex-col items-center justify-center p-1 relative">
                        <span className="text-[7px] sm:text-[7.5px] font-black tracking-widest uppercase text-amber-950 print:text-black leading-none">
                          ★ LEGAL & LICENSED ★
                        </span>
                        <div className="my-1 py-0.5 px-2 bg-[#0A192F] text-amber-300 print:bg-black print:text-white rounded flex items-center gap-1 shadow-2xs">
                          <Award className="w-2.5 h-2.5 text-amber-300 print:text-white shrink-0" />
                          <span className="text-[7.5px] sm:text-[8px] font-black uppercase tracking-tight">
                            RESMI & BERIZIN
                          </span>
                        </div>
                        <span className="text-[6.5px] sm:text-[7px] font-extrabold uppercase tracking-tight text-slate-800 print:text-black leading-tight">
                          IPLT SUMUR BATU
                        </span>
                        <span className="text-[5.5px] font-mono font-bold text-slate-600 print:text-black leading-none mt-0.5">
                          NIB: 3701100028193
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PROMINENT OFFICIAL 'LEGAL & LICENSED' BADGE ELEMENT */}
                <div 
                  id="faq-legal-licensed-badge"
                  className="mt-3.5 p-3 rounded-xl bg-gradient-to-r from-[#0A192F] via-slate-900 to-emerald-950 text-white print:bg-white print:text-slate-900 border-2 border-emerald-500/80 print:border-slate-800 shadow-xs break-inside-avoid"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Official Medallion Badge Icon */}
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400 print:border-slate-800 print:bg-slate-100 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-6 h-6 text-emerald-400 print:text-slate-900" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm font-black tracking-wide uppercase text-white print:text-black flex items-center gap-1.5">
                            LEGAL & LICENSED
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 print:bg-black" />
                            BADAN USAHA SANITASI RESMI
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500 text-white print:bg-slate-200 print:text-black print:border print:border-black">
                            TERDAFTAR & SAH
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 print:text-slate-700 leading-snug mt-0.5">
                          Berizin operasional resmi, teraudit, dan terdaftar di bawah pengawasan regulasi sanitasi lingkungan hidup Kota & Kab. Bekasi.
                        </p>
                      </div>
                    </div>

                    {/* Verification Pillars Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap sm:justify-end text-[10px]">
                      <div className="px-2 py-1 rounded-md bg-white/10 print:bg-slate-100 border border-white/20 print:border-slate-400 font-bold text-emerald-300 print:text-black flex items-center gap-1">
                        <BadgeCheck className="w-3 h-3 text-emerald-400 print:text-black shrink-0" />
                        <span>NIB KBLI 37011</span>
                      </div>
                      <div className="px-2 py-1 rounded-md bg-white/10 print:bg-slate-100 border border-white/20 print:border-slate-400 font-bold text-amber-300 print:text-black flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-400 print:text-black shrink-0" />
                        <span>Mitra Sah IPLT Sumur Batu</span>
                      </div>
                      <div className="px-2 py-1 rounded-md bg-white/10 print:bg-slate-100 border border-white/20 print:border-slate-400 font-bold text-cyan-300 print:text-black flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-cyan-400 print:text-black shrink-0" />
                        <span>Manifest Limbah Resmi</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              {/* DATE & TIMESTAMP HEADER - OFFICIAL METADATA BAR */}
              <div 
                id="faq-date-timestamp-header"
                className="mt-4 p-3.5 bg-slate-50 border border-slate-300 rounded-xl print:bg-white print:border-slate-800"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 print:border-slate-400 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5 text-slate-800 font-extrabold">
                    <FileText className="w-3.5 h-3.5 text-[#00C2CB]" />
                    LEMBAR PUBLIKASI & REFERENSI TANYA JAWAB (FAQ) RESMI
                  </span>
                  <span className="font-mono text-slate-700 text-[9px] sm:text-[10px]">
                    REF NO: {docMeta.docRef} • GENERATED: {docMeta.generatedOn}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* Field 1: Tanggal */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                      <Calendar className="w-3 h-3 text-slate-700" />
                      <span>Tanggal Terbit</span>
                    </div>
                    <div className="font-bold text-slate-800 text-[11px] leading-snug">
                      {docMeta.dateFormatted}
                    </div>
                  </div>

                  {/* Field 2: Waktu & Timestamp */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                      <Clock className="w-3 h-3 text-slate-700" />
                      <span>Timestamp Cetak</span>
                    </div>
                    <div className="font-bold text-slate-800 text-[11px] leading-snug font-mono">
                      {docMeta.timeFormatted}
                    </div>
                  </div>

                  {/* Field 3: Kategori & Jumlah */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase font-semibold">
                      <ShieldCheck className="w-3 h-3 text-slate-700" />
                      <span>Kategori Filter</span>
                    </div>
                    <div className="font-bold text-slate-800 text-[11px] leading-snug truncate" title={activeCategory}>
                      {activeCategory} ({faqs.length} FAQ)
                    </div>
                  </div>

                  {/* Field 4: Status Keabsahan */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 uppercase font-bold">
                      <BadgeCheck className="w-3 h-3 text-emerald-600" />
                      <span>Status Dokumen</span>
                    </div>
                    <div className="font-extrabold text-emerald-800 text-[11px] leading-snug">
                      SAH & TERVERIFIKASI
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/80 print:border-slate-300 flex flex-wrap items-center justify-between text-[10px] text-slate-500">
                  <span>
                    Dicetak secara resmi untuk panduan SOP teknis pelanggan residensial, niaga, dan industri.
                  </span>
                  <span className="font-mono text-slate-400 text-[9px]">
                    ISO-TIMESTAMP: {docMeta.isoTimestamp}
                  </span>
                </div>
              </div>

              {/* LAST UPDATED METADATA LINE */}
              <div 
                id="faq-last-updated-meta"
                className="mt-2.5 px-3 py-1.5 bg-emerald-50/70 border border-emerald-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs print:bg-slate-50 print:border-slate-400 print:text-slate-800"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse print:hidden" />
                    <span className="uppercase tracking-wider text-[10px] text-slate-600 font-extrabold">Last Updated:</span>
                    <span className="text-emerald-900 font-bold print:text-black">{docMeta.lastUpdated}</span>
                  </span>
                  <span className="text-slate-300 print:text-slate-400">•</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 print:text-slate-700">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    Dokumen Terkini & Valid (SOP Operasional Sanitasi Bekasi)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-medium italic print:not-italic print:text-slate-600">
                  Status: <span className="text-emerald-700 font-bold uppercase print:text-black">Current</span> (Tidak Memerlukan Pembaruan Tambahan)
                </div>
              </div>

              {/* UNIQUE DOCUMENT ID METADATA LINE */}
              <div 
                id="faq-document-id-meta"
                className="mt-2 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs print:bg-white print:border-slate-400 print:text-slate-800"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                    <Fingerprint className="w-3.5 h-3.5 text-[#00C2CB] print:text-slate-700 shrink-0" />
                    <span className="uppercase tracking-wider text-[10px] text-slate-600 font-extrabold">Document ID:</span>
                    <span className="font-mono font-bold text-[#0A192F] text-xs px-2 py-0.5 bg-white border border-slate-300 rounded shadow-xs print:border-slate-500 print:text-black">
                      {docMeta.documentId}
                    </span>
                  </span>
                  <span className="text-slate-300 print:text-slate-400">•</span>
                  <span className="text-[10px] text-slate-600 font-medium print:text-slate-700">
                    Autentikasi Digital & Integritas Dokumen Resmi
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 print:text-slate-700 shrink-0" />
                  <span>Sistem Verifikasi PT KGR</span>
                </div>
              </div>

            {/* DAFTAR ISI (TABLE OF CONTENTS) NAVIGATIONAL LINK SECTION */}
            <div 
              id="faq-daftar-isi"
              className="mb-6 p-4 rounded-2xl border border-slate-300 bg-slate-50/80 print:bg-white print:border-slate-400 break-inside-avoid print:break-inside-avoid shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-200 print:border-slate-300 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#0A192F] text-white flex items-center justify-center shrink-0">
                    <ListOrdered className="w-4 h-4 text-[#00C2CB]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-[#0A192F] uppercase tracking-wide">
                      Daftar Isi (Navigasi Kategori Dokumen)
                    </h3>
                    <p className="text-[10px] text-slate-500 print:text-slate-600">
                      Indeks Navigasi Cepat • {exportCategories.length} Kategori • {faqs.length} Pertanyaan Resmi
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-200/80 text-slate-700 print:bg-slate-100 px-2.5 py-0.5 rounded-md font-mono font-bold">
                  Indeks Halaman 1
                </span>
              </div>

              {/* Grid Link Navigasi Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {exportCategories.map((cat, idx) => (
                  <a
                    key={cat.slug}
                    href={`#${cat.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      const target = document.getElementById(cat.slug);
                      if (target) {
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="group flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 hover:border-[#00C2CB] hover:bg-cyan-50/50 transition-all text-slate-700 hover:text-[#0A192F] print:border-none print:p-0.5 print:bg-transparent shadow-2xs print:shadow-none"
                    title={`Klik untuk melompat langsung ke kategori ${cat.name}`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 h-5 rounded-md bg-[#0A192F]/10 group-hover:bg-[#00C2CB]/20 text-[#0A192F] text-[10px] font-black flex items-center justify-center shrink-0 print:border print:border-slate-300">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0A192F] underline decoration-slate-300 group-hover:decoration-[#00C2CB] underline-offset-2 print:no-underline truncate">
                        {cat.name}
                      </span>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                      <span className="print:inline hidden text-slate-400 select-none">................</span>
                      <span className="bg-slate-100 group-hover:bg-cyan-100 px-2 py-0.5 rounded-md text-slate-800 font-bold print:border print:border-slate-200">
                        {cat.count} Butir (No. {cat.firstIndex}–{cat.lastIndex})
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-200/80 text-[10px] text-slate-500 flex flex-wrap items-center justify-between gap-1 print:text-slate-600">
                <span className="italic">
                  * Klik kategori untuk melompat otomatis ke bagian pembahasan pada pratinjau digital / cetak.
                </span>
                <span className="font-semibold text-slate-700">
                  Total Tercetak: {faqs.length} FAQ
                </span>
              </div>
            </div>

            {/* HIGH-CONTRAST COMPLIANCE NOTICE BLOCK FOR PRINT & DIGITAL READERS */}
            <div 
              id="faq-print-compliance-notice"
              className="mb-6 p-4 rounded-2xl bg-[#0A192F] text-white print:bg-white print:text-black border-2 border-emerald-500 print:border-black shadow-xs break-inside-avoid print:break-inside-avoid"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 print:bg-slate-100 border border-emerald-400 print:border-black flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-emerald-400 print:text-black" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-black uppercase tracking-wider text-[10px] text-emerald-300 print:text-black bg-emerald-500/10 print:bg-slate-200 px-2 py-0.5 rounded border border-emerald-400/30 print:border-black">
                      COMPLIANCE NOTICE • STANDAR REGULASI PERDA & LINGKUNGAN HIDUP
                    </span>
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 print:bg-black print:text-white">
                      100% AMAN & LEGAL
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-white print:text-black leading-snug">
                    Pemberitahuan Kepatuhan Hukum & Baku Mutu Pembuangan Limbah
                  </h3>
                  <p className="text-[11px] text-slate-200 print:text-slate-800 mt-1 leading-relaxed">
                    Seluruh armada dan teknisi PT Kusuma Gemilang Raya beroperasi di bawah kepatuhan ketat <strong>Peraturan Daerah (Perda) Kota & Kabupaten Bekasi</strong> mengenai pengelolaan air limbah domestik dan industri non-B3. Pembuangan limbah disalurkan secara tertib ke instalasi pengolahan resmi <strong>IPLT Sumur Batu</strong> dan diverifikasi dengan dokumen Berita Acara & Manifest sah untuk audit ISO/lingkungan klien komersial.
                  </p>
                  <div className="mt-2 pt-1.5 border-t border-slate-700 print:border-slate-300 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-300 print:text-slate-900 font-semibold">
                    <span>✓ Kepatuhan Perda Lingkungan Hidup</span>
                    <span>✓ Pembuangan Resmi IPLT Sumur Batu</span>
                    <span>✓ Manifest Limbah Siap Audit</span>
                    <span>✓ NIB KBLI 37011 Berizin Resmi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Judul Isi Dokumen */}
            <div className="mb-6">
              <h2 className="text-lg sm:text-xl font-black text-[#0A192F]">
                Daftar Tanya Jawab Resmi ({faqs.length} Pertanyaan)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Panduan teknis dan informasi standar layanan sanitasi untuk hunian tinggal, kawasan komersial, dan fasilitas industri di wilayah Bekasi.
              </p>
            </div>

            {/* List Pertanyaan & Jawaban */}
            <div className="space-y-6">
              {faqs.map((faq, index) => {
                const catSlug = `faq-cat-${(faq.category || 'Umum').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
                const isFirstOfCategory = index === 0 || (faqs[index - 1].category || 'Umum') !== (faq.category || 'Umum');
                const catIndex = exportCategories.findIndex(c => c.slug === catSlug);

                return (
                  <div key={faq.id || index} className="space-y-3">
                    {/* Category Anchor Section Header */}
                    {isFirstOfCategory && (
                      <div 
                        id={catSlug} 
                        className="scroll-mt-6 pt-3 pb-1 border-b-2 border-slate-300 print:border-slate-800 flex items-center justify-between"
                      >
                        <h3 className="font-extrabold text-sm sm:text-base text-[#0A192F] uppercase tracking-wide flex items-center gap-2">
                          <span className="w-2 h-4 bg-[#00C2CB] rounded-xs inline-block"></span>
                          <span>Bagian {catIndex + 1}: {faq.category || 'Umum'}</span>
                        </h3>
                        <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded print:border print:border-slate-300 print:text-slate-800">
                          {exportCategories[catIndex]?.count || 1} Pertanyaan
                        </span>
                      </div>
                    )}

                    <div 
                      id={`faq-item-${index + 1}`}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 break-inside-avoid print:bg-white print:border-slate-300 shadow-2xs print:shadow-none relative"
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-start gap-2.5 flex-1">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[#0A192F] text-white font-bold text-xs shrink-0 print:border print:border-black">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {faq.category && (
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-200/80 px-1.5 py-0.5 rounded print:border print:border-slate-400">
                                  {faq.category}
                                </span>
                              )}
                              {faq.badge && (
                                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  {faq.badge === 'Verified' ? 'Terverifikasi' : 'Standar Resmi'}
                                </span>
                              )}
                              {faq.highlightType === 'pricing' && (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                                  Tarif Resmi
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-sm text-[#0A192F] leading-snug">
                              {faq.q}
                            </h4>
                          </div>
                        </div>

                        {/* Quick Share Action Button next to FAQ Header (Screen Only - hidden when printing) */}
                        <div className="relative shrink-0 no-print faq-share-container">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const itemKey = String(faq.id || index + 1);
                              setActiveShareMenuId(activeShareMenuId === itemKey ? null : itemKey);
                            }}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 text-xs font-semibold ${
                              activeShareMenuId === String(faq.id || index + 1)
                                ? 'bg-[#00C2CB] text-[#0A192F] border-[#00C2CB] shadow-xs'
                                : 'bg-white text-slate-600 hover:text-[#0A192F] hover:bg-slate-100 border-slate-200'
                            }`}
                            title="Bagikan pertanyaan ini ke WhatsApp, Twitter, atau Email"
                            aria-label={`Bagikan pertanyaan ${faq.q}`}
                          >
                            <Share2 className="w-3.5 h-3.5 text-[#00C2CB] group-hover:scale-110" />
                            <span className="hidden sm:inline text-[11px]">Bagikan</span>
                          </button>

                          {/* Quick Share Flyout Menu */}
                          {activeShareMenuId === String(faq.id || index + 1) && (
                            <div 
                              className="absolute right-0 top-full mt-1.5 z-30 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 text-xs animate-fadeIn"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                                Bagikan Tanya Jawab
                              </div>
                              <button
                                type="button"
                                onClick={() => handleShareWhatsApp(faq, index)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 transition-colors cursor-pointer text-left font-medium"
                              >
                                <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </span>
                                <span>Kirim ke WhatsApp</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShareTwitter(faq, index)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-sky-50 text-slate-700 hover:text-sky-800 transition-colors cursor-pointer text-left font-medium"
                              >
                                <span className="w-6 h-6 rounded-md bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                                  <Twitter className="w-3.5 h-3.5" />
                                </span>
                                <span>Bagikan ke Twitter / X</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleShareEmail(faq, index)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 transition-colors cursor-pointer text-left font-medium"
                              >
                                <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                  <Mail className="w-3.5 h-3.5" />
                                </span>
                                <span>Kirim via Email</span>
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                type="button"
                                onClick={() => handleCopyFaqDirectText(faq, index)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer text-left font-medium"
                              >
                                <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                  {copiedShareFaqId === String(faq.id || index + 1) ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </span>
                                <span>
                                  {copiedShareFaqId === String(faq.id || index + 1)
                                    ? 'Tersalin ke Clipboard!'
                                    : 'Salin Teks FAQ'}
                                </span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pl-8 text-xs text-slate-700 leading-relaxed">
                        <p className="whitespace-pre-line">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* OFFICIAL ENDORSEMENT SECTION: COMPANY STAMP & QR CODE BOOKING BLOCK */}
            <div className="mt-8 pt-6 border-t-2 border-slate-900 break-inside-avoid print:break-inside-avoid">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  KOLOM PENGESAHAN DOKUMEN & AKSES CEPAT LAYANAN
                </span>
                <span className="text-[10px] text-slate-400 font-normal">
                  PT Kusuma Gemilang Raya • Hak Cipta Dilindungi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BLOK 1: QR CODE PEMESANAN & REDIRECT CONVERSION */}
                <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50/70 print:bg-white print:border-slate-400 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-[#0A192F] text-white flex items-center justify-center shrink-0">
                        <QrCodeIcon className="w-4 h-4 text-[#00C2CB]" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-[#0A192F] uppercase tracking-wide leading-tight">
                          Pindai QR Code untuk Reservasi Cepat
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Langsung terhubung ke WhatsApp Booking Resmi 24 Jam
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 mt-3">
                      {/* High-Resolution Scannable QR Code */}
                      <div className="shrink-0 flex flex-col items-center relative">
                        {/* High-Contrast 'Scan Me' Visual Icon & Arrow Indicator pointing directly at QR Code */}
                        <div className="relative group/scanme flex flex-col items-center">
                          <div 
                            id="faq-scan-me-indicator"
                            className="mb-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0A192F] text-amber-300 border-2 border-amber-400 font-black text-[9px] tracking-wider uppercase shadow-xs print:bg-black print:text-white print:border-black cursor-help"
                            title="Cara Scan: Buka kamera HP atau Google Lens & arahkan ke QR Code"
                          >
                            <Scan className="w-3 h-3 text-[#00C2CB] print:text-white shrink-0" />
                            <span className="font-extrabold">SCAN ME</span>
                            <ArrowDown id="faq-scan-me-arrow" className="w-2.5 h-2.5 text-amber-300 print:text-white shrink-0 animate-bounce print:animate-none" />
                          </div>

                          {/* 'How to Scan' Tooltip / Quick Instruction Block near Scan Me Indicator */}
                          <div 
                            id="faq-how-to-scan-tooltip"
                            className="mb-1 px-2 py-0.5 rounded bg-slate-900 text-amber-200 border border-amber-400/80 text-[8px] font-semibold text-center flex items-center gap-1 shadow-xs print:bg-white print:text-slate-900 print:border-slate-400"
                            title="Petunjuk praktis pemindaian QR code"
                          >
                            <Camera className="w-2.5 h-2.5 text-[#00C2CB] print:text-black shrink-0" />
                            <span><strong>How to scan:</strong> Buka Kamera HP &gt; Arahkan ke QR</span>
                          </div>
                        </div>

                        <div className="relative">
                          {/* Subtle floating corner arrow indicator pointing at the QR code */}
                          <div 
                            id="faq-qr-corner-arrow"
                            className="absolute -top-2 -right-2 z-10 bg-amber-400 text-slate-950 font-black text-[8px] px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 border border-amber-500 uppercase tracking-tighter print:bg-black print:text-white print:border-black"
                            title="Petunjuk Scan QR"
                          >
                            <span>Scan Me</span>
                            <ArrowDown className="w-2 h-2" />
                          </div>

                          <a 
                            href={bookingWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block bg-white p-2 rounded-xl border-2 border-slate-300 hover:border-emerald-500 shadow-xs transition-all cursor-pointer text-center relative"
                            title="Klik untuk membuka WhatsApp Booking Channel"
                          >
                            {qrCodeDataUrl ? (
                              <img 
                                src={qrCodeDataUrl} 
                                alt="QR Code WhatsApp Booking PT Kusuma Gemilang Raya" 
                                className="w-24 h-24 sm:w-28 sm:h-28 object-contain mx-auto"
                              />
                            ) : (
                              <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-slate-100 text-slate-400 text-[10px]">
                                Memuat QR...
                              </div>
                            )}
                            <span className="block mt-1 text-[9px] font-bold text-slate-600 group-hover:text-emerald-600 uppercase">
                              Scan / Klik QR
                            </span>
                          </a>
                        </div>

                        {/* Small Instructional Text Block near QR code */}
                        <div 
                          id="faq-qr-instruction"
                          className="mt-1.5 w-full max-w-[110px] sm:max-w-[120px] px-1.5 py-1 bg-emerald-50 border border-emerald-300 rounded-md text-center shadow-2xs print:bg-white print:border-emerald-600"
                        >
                          <p className="text-[9px] font-bold text-emerald-900 print:text-slate-900 leading-tight">
                            Scan QR untuk Booking Cepat via WhatsApp
                          </p>
                        </div>
                      </div>

                      {/* Conversion Value Props for Physical Printouts */}
                      <div className="space-y-1.5 text-[11px] text-slate-600 flex-1">
                        <div className="p-2 bg-emerald-50/70 rounded-lg border border-emerald-200/90 print:bg-slate-50 print:border-slate-300">
                          <p className="font-bold text-emerald-900 print:text-slate-900 text-[11px] leading-snug flex items-center gap-1.5">
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            Scan QR untuk Booking Cepat via WhatsApp
                          </p>
                          <p className="text-[10px] text-slate-600 mt-0.5 leading-snug">
                            Arahkan kamera smartphone ke kode QR untuk konsultasi teknis atau reservasi armada darurat 24 jam.
                          </p>
                        </div>
                        <div className="space-y-0.5 text-[10px]">
                          <div className="flex items-center gap-1 font-semibold text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Respon Cepat & Tanggap Darurat</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Kwitansi & Manifest Limbah Resmi</span>
                          </div>
                          <div className="flex items-center gap-1 font-semibold text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Garansi Tuntas Tanpa Biaya Tersembunyi</span>
                          </div>
                        </div>
                        <div className="pt-1 border-t border-slate-200">
                          <span className="font-mono text-[10px] text-slate-500 font-bold block">
                            wa.me/{CONTACT_INFO.phoneRaw}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-[9px] text-slate-400 italic border-t border-slate-200/80 pt-1.5">
                    *Meningkatkan konversi layanan langsung dari dokumen fisik tanpa perlu simpan nomor kontak manual.
                  </p>
                </div>

                {/* BLOK 2: COMPANY STAMP & AUTHORIZATION PLACEHOLDER BLOCK */}
                <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50/70 print:bg-white print:border-slate-400 relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-600 font-medium">Kota Administrasi Bekasi</span>
                      <span className="text-[11px] font-bold text-slate-700">{docMeta.dateFormatted}</span>
                    </div>
                    <p className="text-xs font-bold text-[#0A192F] uppercase">
                      PT KUSUMA GEMILANG RAYA
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Divisi Pengendalian Mutu & Sanitasi Lingkungan
                    </p>

                    {/* Area Tanda Tangan & STEMPEL PERUSAHAAN */}
                    <div className="relative my-3 h-28 flex items-center justify-between">
                      {/* AUTHENTIC OFFICIAL COMPANY STAMP PLACEHOLDER */}
                      <div 
                        className="w-28 h-28 rounded-full border-2 border-indigo-900/85 p-1 flex items-center justify-center text-center -rotate-6 select-none shadow-xs print:border-indigo-950"
                        title="Stempel Resmi PT Kusuma Gemilang Raya"
                        style={{ color: '#1E3A8A' }}
                      >
                        <div className="w-full h-full rounded-full border border-dashed border-indigo-800 flex flex-col items-center justify-center p-1 relative">
                          <span className="text-[7.5px] font-black tracking-wider uppercase leading-none text-indigo-950">
                            ★ PT KUSUMA GEMILANG RAYA ★
                          </span>
                          <div className="my-1 py-0.5 px-2 bg-indigo-50/90 border-y border-indigo-800 text-indigo-950 flex flex-col items-center">
                            <span className="text-[8px] font-black tracking-tight leading-none uppercase">
                              STEMPEL RESMI
                            </span>
                            <span className="text-[6.5px] font-extrabold tracking-widest text-indigo-800 leading-none mt-0.5">
                              TERVERIFIKASI IPLT
                            </span>
                          </div>
                          <span className="text-[7px] font-bold tracking-tight uppercase leading-none text-indigo-900">
                            ★ KOTA & KAB. BEKASI ★
                          </span>
                          <span className="text-[5.5px] font-mono text-indigo-700 uppercase mt-0.5">
                            NIB: 37011
                          </span>
                        </div>
                      </div>

                      {/* Tanda Tangan Digital & Garis Verifikasi */}
                      <div className="text-right flex-1 pl-4 flex flex-col justify-end h-full">
                        <div className="h-16 flex items-center justify-end pr-2">
                          {/* Signature SVG Glyph */}
                          <svg className="w-24 h-12 text-slate-800/80" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="1.8">
                            <path d="M10 25 C20 10, 25 35, 35 15 C45 -5, 48 38, 60 20 C70 5, 75 30, 85 22 C90 18, 95 24, 98 25" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M30 28 C45 28, 65 30, 95 28" strokeLinecap="round" />
                          </svg>
                        </div>
                        <div className="border-t border-slate-400 pt-1">
                          <p className="font-extrabold text-xs text-slate-900 leading-tight">
                            Ir. Bambang S., S.T.
                          </p>
                          <p className="text-[10px] text-slate-600 leading-tight">
                            Penanggung Jawab Teknis Sanitasi
                          </p>
                          <p className="text-[9px] text-slate-500 font-mono">
                            SIP. 3275-KGR-IPLT-2026
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <BadgeCheck className="w-3 h-3 text-emerald-600" />
                      Legalitas Sah IPLT Sumur Batu
                    </span>
                    <span className="font-mono text-slate-400">
                      KODE: KGR-AUTH-2026
                    </span>
                  </div>

                  {/* Subtle Indicator & Arrow pointing directly at QR Code */}
                  <div 
                    id="faq-stamp-qr-nudge"
                    className="mt-2 pt-1.5 border-t border-dashed border-slate-300 print:border-slate-400 flex items-center justify-between text-[8.5px] text-slate-700 print:text-slate-900 bg-amber-50/70 print:bg-white p-1.5 rounded-lg border border-amber-200/80 print:border-slate-300"
                  >
                    <span className="flex items-center gap-1.5 font-bold">
                      <ArrowLeft className="w-3 h-3 text-amber-700 print:text-black shrink-0 animate-pulse print:animate-none" />
                      <span>Pindai <strong>QR Code (Scan Me)</strong> untuk respon langsung</span>
                    </span>
                    <span className="font-black text-[7.5px] uppercase tracking-wider bg-amber-300 text-slate-950 px-1 py-0.5 rounded print:border print:border-black">
                      24 Jam
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PROMINENT OFFICIAL COMPANY WHATSAPP QR CODE AT DOCUMENT BOTTOM */}
            <div 
              id="faq-bottom-official-qr-code" 
              className="mt-7 p-4 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-slate-50 print:bg-white rounded-2xl border-2 border-emerald-500/80 print:border-slate-800 shadow-xs print:shadow-none break-inside-avoid print:break-inside-avoid"
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Text & Contact Directives */}
                <div className="flex-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white print:bg-black print:text-white font-extrabold text-[9px] uppercase tracking-wider mb-1.5">
                    <MessageCircle className="w-3 h-3 text-[#00C2CB] print:text-white shrink-0" />
                    <span>WhatsApp Booking & Konsultasi Resmi 24 Jam</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-[#0A192F] print:text-black tracking-tight">
                    Butuh Layanan Cepat? Pindai QR Code WhatsApp Ini
                  </h3>
                  <p className="text-xs text-slate-600 print:text-slate-800 mt-1 max-w-md leading-relaxed">
                    Arahkan kamera ponsel Anda langsung ke kode QR resmi PT Kusuma Gemilang Raya untuk terhubung dengan tim customer service & dispatch armada terdekat di Kota / Kab. Bekasi tanpa perlu menyimpan nomor terlebih dahulu.
                  </p>
                  
                  <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] font-bold text-slate-700 print:text-slate-900">
                    <span className="flex items-center gap-1 text-emerald-800 print:text-black">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 print:text-black" />
                      Hotline: {CONTACT_INFO.phoneDisplay}
                    </span>
                    <span>•</span>
                    <span className="font-mono text-slate-600 print:text-slate-900">
                      wa.me/{CONTACT_INFO.phoneRaw}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 print:text-slate-800 font-semibold text-[10px]">
                      Siaga 24 Jam Nonstop
                    </span>
                  </div>
                </div>

                {/* Prominent High-Contrast QR Code Card */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative group p-2.5 bg-white rounded-2xl border-2 border-slate-900 print:border-black shadow-md print:shadow-none text-center">
                    {/* Badge on QR frame */}
                    <div className="mb-1 flex items-center justify-center gap-1 bg-[#0A192F] text-amber-300 print:bg-black print:text-white px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider">
                      <Scan className="w-2.5 h-2.5 text-[#00C2CB] print:text-white" />
                      <span>PINDAI DISINI</span>
                    </div>

                    <a 
                      href={bookingWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block cursor-pointer transition-transform hover:scale-105"
                      title="Klik atau scan untuk membuka chat WhatsApp resmi"
                    >
                      {qrCodeDataUrl ? (
                        <img 
                          src={qrCodeDataUrl} 
                          alt="QR Code WhatsApp Resmi PT Kusuma Gemilang Raya" 
                          className="w-28 h-28 sm:w-32 sm:h-32 object-contain mx-auto"
                          loading="eager"
                        />
                      ) : (
                        <div className="w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center bg-slate-100 text-slate-400 text-xs">
                          Memuat QR...
                        </div>
                      )}
                    </a>

                    <div className="mt-1 pt-1 border-t border-slate-200 text-[8.5px] font-extrabold uppercase tracking-wide text-slate-700 print:text-black">
                      Official WhatsApp QR
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Dokumen Resmi */}
            <div className="mt-8 pt-5 border-t border-slate-300 text-xs text-slate-500 break-inside-avoid">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-slate-700">Layanan Pelanggan & Konsultasi Teknis:</p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-slate-600" />
                    <span>WhatsApp / Telepon: {CONTACT_INFO.phoneDisplay}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-600" />
                    <span>Wilayah Operasional: {CONTACT_INFO.legal.serviceArea}</span>
                  </p>
                </div>
                <div className="sm:text-right space-y-1">
                  <p className="font-bold text-slate-700">PT KUSUMA GEMILANG RAYA</p>
                  <p className="text-[11px]">Sertifikasi & Kemitraan Resmi IPLT Sumur Batu Bekasi</p>
                  <p className="text-[10px] text-slate-400">Dicetak secara digital melalui portal resmi • Ref: {docMeta.docRef}</p>
                </div>
              </div>
            </div>

            {/* DYNAMIC PAGE NUMBERING FOOTER FOR MULTI-PAGE FAQ EXPORTS */}
            <div className="mt-5 pt-3.5 border-t border-slate-200 text-xs text-slate-500 break-inside-avoid">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
                <div className="flex items-center gap-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 print:bg-emerald-700"></span>
                  <span className="font-semibold text-slate-700">
                    Dokumen Resmi FAQ PT Kusuma Gemilang Raya
                  </span>
                  <span className="text-slate-300 print:text-slate-400">•</span>
                  <span className="font-mono text-slate-500 text-[10px]">
                    REF: {docMeta.docRef}
                  </span>
                </div>

                {/* Dynamic Page Indicator (e.g., 'Page 1 of 3') */}
                <div className="flex items-center gap-2 bg-slate-100 print:bg-slate-50 border border-slate-300 print:border-slate-400 px-3 py-1 rounded-lg">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Halaman / Page:
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    <span className="print:hidden">Page 1 of {totalPages}</span>
                    <span className="hidden print:inline">
                      Page <span className="faq-page-counter-curr"></span> of {totalPages}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* PRINT DISCLAIMER FOOTER AT THE VERY END OF CONTENT */}
            <div 
              id="faq-print-disclaimer" 
              className="mt-4 p-3.5 rounded-xl border border-amber-300/80 bg-amber-50/60 print:bg-white print:border-slate-400 text-slate-700 break-inside-avoid print:break-inside-avoid"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 print:text-slate-800 shrink-0 mt-0.5" />
                <div className="text-[10.5px] leading-relaxed space-y-1 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="font-bold text-slate-900 uppercase tracking-wide text-[10.5px]">
                      Print Disclaimer / Pernyataan Keabsahan Dokumen
                    </span>
                    <span className="text-[9px] font-bold text-amber-800 print:text-slate-700 bg-amber-100/90 print:bg-slate-100 px-2 py-0.5 rounded border border-amber-200 print:border-slate-300 uppercase tracking-wider">
                      Informasi Non-Finansial
                    </span>
                  </div>
                  <p className="text-slate-600 print:text-slate-800 text-[10px] leading-relaxed">
                    Dokumen ini dicetak dan diterbitkan semata-mata untuk tujuan informasi umum serta panduan teknis operasional sanitasi pelanggan. Dokumen ini <strong>bukan merupakan bukti transaksi pembayaran, perjanjian kerja resmi, atau dokumen hukum yang mengikat</strong>. Untuk keperluan pembuktian hukum resmi, pelaporan audit perusahaan/lingkungan, serta klaim garansi yang sah, pelanggan diwajibkan menyertakan <strong>Invoice / Kwitansi Resmi Berstempel Basah & Bertanda Tangan PT Kusuma Gemilang Raya</strong> beserta Manifest Pembuangan Limbah Resmi dari instalasi pengolahan limbah (IPLT).
                  </p>
                  <div className="flex flex-wrap items-center justify-between text-[9px] text-slate-500 print:text-slate-600 pt-1.5 border-t border-amber-200/80 print:border-slate-300 font-medium">
                    <span>* Requires official stamped invoice for official legal service proof</span>
                    <span>PT Kusuma Gemilang Raya • Divisi Legal & Pengendalian Mutu</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RUNNING REPEATING PRINT FOOTER FOR MULTI-PAGE EXPORTS (PRINT ONLY) */}
            <footer 
              id="faq-running-print-footer"
              aria-hidden="true" 
              className="faq-running-print-footer hidden print:flex"
            >
              <div className="flex items-center gap-2 text-[8pt] text-slate-800">
                <span className="font-extrabold text-slate-900">FAQ Layanan Sanitasi - PT Kusuma Gemilang Raya</span>
                <span>•</span>
                <span>Hotline: {CONTACT_INFO.phoneDisplay}</span>
                <span>•</span>
                <span>REF: {docMeta.docRef}</span>
              </div>
              <div className="flex items-center gap-1.5 border border-slate-600 bg-slate-50 px-2 py-0.5 rounded font-mono font-bold text-slate-900 text-[8pt]">
                <span className="uppercase text-[7pt] tracking-wider text-slate-600">Halaman /</span>
                <span>Page</span>
                <span className="faq-page-counter-curr"></span>
                <span>of</span>
                <span>{totalPages}</span>
              </div>
            </footer>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Screen only) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <span>
            Tekan tombol <strong>Cetak Sekarang</strong> untuk mencetak langsung ke printer fisik atau menyimpan sebagai dokumen PDF.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold border border-slate-300 transition-colors cursor-pointer"
            >
              Tutup Pratinjau
            </button>
            <button
              type="button"
              onClick={() => exportFaqsToCsv(faqs, {
                activeCategory,
                searchQuery
              })}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              title="Unduh seluruh FAQ sebagai CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-200" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0A192F] hover:bg-[#172A45] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-[#00C2CB]" />
              <span>Cetak Dokumen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
