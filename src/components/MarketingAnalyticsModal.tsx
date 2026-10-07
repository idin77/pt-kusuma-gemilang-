import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  X, 
  PhoneCall, 
  Clock, 
  RotateCcw, 
  Sparkles,
  Award
} from 'lucide-react';
import { getStoredConversions, ConversionSummary } from '../utils/conversionTracker';

interface MarketingAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarketingAnalyticsModal({ isOpen, onClose }: MarketingAnalyticsModalProps) {
  const [stats, setStats] = useState<ConversionSummary | null>(null);

  const reloadStats = () => {
    setStats(getStoredConversions());
  };

  useEffect(() => {
    if (isOpen) {
      reloadStats();
    }
  }, [isOpen]);

  if (!isOpen || !stats) return null;

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset data statistik konversi ini?')) {
      if (typeof window.__resetMarketingStats === 'function') {
        window.__resetMarketingStats();
      } else {
        localStorage.removeItem('ptkgr_marketing_conversions_v1');
      }
      reloadStats();
    }
  };

  const sourceLabels: Record<string, string> = {
    hero_cta: 'Hero Section (Hubungi Sekarang)',
    mobile_floating_bar: 'Floating Action Bar (Mobile)',
    floating_desktop_wa: 'Tombol Floating WA (Desktop)',
    header_wa_button: 'Tombol Header Atas',
    price_estimator_form: 'Kalkulator Estimasi Biaya',
    gallery_modal_cta: 'Galeri Foto Lapangan',
    service_detail_modal: 'Modal Detail Layanan',
    area_checker_order: 'Area Layanan (Kecamatan)',
    final_cta_section: 'Section Bawah (Final CTA)',
    general_whatsapp_link: 'Link WhatsApp Umum',
    general_phone_link: 'Link Telepon Langsung'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col text-[#0A192F]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C2CB]/20 flex items-center justify-center text-[#00C2CB]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Evaluasi Pemasaran & Pelacakan Konversi</h3>
              <p className="text-xs text-cyan-200">PT Kusuma Gemilang Raya • Pemantauan Interaksi Calon Klien</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-[#E0F7F9]/50 p-4 rounded-2xl border border-[#00C2CB]/30">
              <span className="text-xs font-bold text-slate-500 block mb-1">Total Klik WhatsApp</span>
              <div className="text-3xl font-black text-[#0A192F] flex items-center gap-2">
                <span>{stats.totalWhatsAppClicks}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">Lead WA</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Calon klien menghubungi via WhatsApp</p>
            </div>

            <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">Panggilan Telepon</span>
              <div className="text-3xl font-black text-[#FF6B00] flex items-center gap-2">
                <span>{stats.totalPhoneCalls}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] font-bold">Panggilan</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Calon klien menekan tombol telepon</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 block mb-1">Total Konversi</span>
              <div className="text-3xl font-black text-slate-800">
                {stats.totalConversions}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Akumulasi seluruh interaksi lead</p>
            </div>

          </div>

          {/* Breakdown per Tombol / Sumber */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0A192F] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00C2CB]" />
              Distribusi Sumber Tombol yang Menghasilkan Lead:
            </h4>

            {Object.keys(stats.sourceBreakdown).length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                Belum ada klik tombol yang tercatat pada sesi ini. Coba klik salah satu tombol WhatsApp di halaman web untuk melihat data masuk secara real-time.
              </div>
            ) : (
              <div className="space-y-2.5">
                {Object.entries(stats.sourceBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([src, count]) => {
                    const pct = stats.totalConversions > 0 
                      ? Math.round((count / stats.totalConversions) * 100) 
                      : 0;
                    return (
                      <div key={src} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between text-xs font-bold text-[#0A192F] mb-1">
                            <span className="truncate">{sourceLabels[src] || src}</span>
                            <span>{count} kali ({pct}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-[#00C2CB] h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Histori Aktivitas Terbaru */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0A192F] mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B00]" />
              Catatan Waktu Interaksi Terakhir:
            </h4>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Pencatatan Pertama:</span>
                <span className="font-semibold text-slate-800">
                  {stats.firstRecordedAt ? new Date(stats.firstRecordedAt).toLocaleString('id-ID') : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pencatatan Terakhir:</span>
                <span className="font-semibold text-slate-800">
                  {stats.lastRecordedAt ? new Date(stats.lastRecordedAt).toLocaleString('id-ID') : '-'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2.5">
            <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong>Kompatibilitas Google Analytics / GA4:</strong> Setiap klik tombol WhatsApp secara otomatis memicu event standar <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">whatsapp_click</code> ke <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">window.dataLayer</code> untuk integrasi Google Tag Manager / Google Ads.
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Evaluasi</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#0A192F] hover:bg-[#172A45] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
