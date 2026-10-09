import React, { useState } from 'react';
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
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { FaqItem, CONTACT_INFO } from '../data/websiteData';

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

  if (!isOpen) return null;

  const printDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAllText = () => {
    const textLines = [
      '==============================================================',
      'PT KUSUMA GEMILANG RAYA - DOKUMEN REFERENSI RESMI FAQ',
      'Jasa Sedot WC, Pembersihan Saluran & Penanganan Limbah Resmi Bekasi',
      `Tanggal Cetak: ${printDate}`,
      `Filter Kategori: ${activeCategory}`,
      searchQuery ? `Kata Kunci Pencarian: "${searchQuery}"` : '',
      `Total Pertanyaan: ${faqs.length}`,
      '==============================================================\n'
    ].filter(Boolean);

    faqs.forEach((item, index) => {
      textLines.push(`${index + 1}. [${item.category || 'FAQ'}] ${item.q}`);
      textLines.push(`   Jawaban: ${item.a}`);
      if (item.badge) {
        textLines.push(`   Status: Terverifikasi (${item.badge})`);
      }
      textLines.push('');
    });

    textLines.push('--------------------------------------------------------------');
    textLines.push(`Layanan Darurat & Konsultasi 24 Jam: ${CONTACT_INFO.phoneDisplay}`);
    textLines.push(`Wilayah Operasional: ${CONTACT_INFO.legal.serviceArea}`);
    textLines.push('Dokumen diterbitkan untuk keperluan referensi profesional pelanggan.');

    navigator.clipboard.writeText(textLines.join('\n')).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
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
                Format resmi ramah cetak (A4 / PDF) untuk referensi operasional & kantor
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
          </div>
          <span className="hidden sm:inline text-amber-700/80 italic text-[11px]">
            Tip: Gunakan "Save as PDF" di menu printer untuk mengunduh dokumen.
          </span>
        </div>

        {/* Printable Document Sheet */}
        <div className="overflow-y-auto p-6 sm:p-10 bg-slate-100 flex-1">
          <div 
            id="faq-printable-area" 
            className="max-w-3xl mx-auto bg-white p-6 sm:p-12 rounded-2xl shadow-md border border-slate-200 text-slate-800 font-sans print:shadow-none print:border-none print:p-0"
          >
            {/* Header Surat Resmi PT Kusuma Gemilang Raya */}
            <div className="border-b-2 border-slate-900 pb-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-[#0A192F] tracking-tight uppercase">
                      PT KUSUMA GEMILANG RAYA
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-300 print:border print:border-emerald-600">
                      LEGAL & RESMI IPLT
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    Spesialis Jasa Sanitasi, Pengurasan Septic Tank & Pengolahan Limbah Cair Industri
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3">
                    <span>Wilayah: {CONTACT_INFO.legal.serviceArea}</span>
                    <span>• Telp / WA: {CONTACT_INFO.phoneDisplay}</span>
                  </p>
                </div>
              </div>

              {/* Baris Meta Dokumen */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                <div>
                  <span className="font-bold text-slate-800">DOKUMEN:</span> LEMBAR INFORMASI & TANYA JAWAB (FAQ)
                </div>
                <div>
                  <span className="font-bold text-slate-800">TANGGAL:</span> {printDate}
                </div>
                <div>
                  <span className="font-bold text-slate-800">KATEGORI:</span> {activeCategory}
                </div>
              </div>
            </div>

            {/* Judul Isi Dokumen */}
            <div className="mb-6">
              <h1 className="text-lg sm:text-xl font-black text-[#0A192F]">
                Daftar Tanya Jawab Resmi ({faqs.length} Pertanyaan)
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Panduan teknis dan informasi standar layanan sanitasi untuk hunian tinggal, kawasan komersial, dan industri.
              </p>
            </div>

            {/* List Pertanyaan & Jawaban */}
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div 
                  key={faq.id || index}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 break-inside-avoid print:bg-white print:border-slate-300"
                >
                  <div className="flex items-start gap-2.5 mb-2">
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

                  <div className="pl-8 text-xs text-slate-700 leading-relaxed">
                    <p className="whitespace-pre-line">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Dokumen Resmi */}
            <div className="mt-10 pt-6 border-t-2 border-slate-200 text-xs text-slate-500 break-inside-avoid">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-slate-700">Layanan Pelanggan & Konsultasi Teknis:</p>
                  <p>WhatsApp / Telepon: {CONTACT_INFO.phoneDisplay}</p>
                  <p>Wilayah Operasional: {CONTACT_INFO.legal.serviceArea}</p>
                </div>
                <div className="sm:text-right space-y-1">
                  <p className="font-bold text-slate-700">PT KUSUMA GEMILANG RAYA</p>
                  <p className="text-[11px]">Sertifikasi & Kemitraan Resmi IPLT Sumur Batu Bekasi</p>
                  <p className="text-[10px] text-slate-400">Dicetak secara digital melalui portal resmi</p>
                </div>
              </div>
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
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-[#0A192F] hover:bg-[#172A45] text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
