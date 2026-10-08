import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  X, 
  PhoneCall, 
  Clock, 
  RotateCcw, 
  Sparkles,
  Award,
  Users,
  MessageSquare,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Calendar
} from 'lucide-react';
import { getStoredConversions, ConversionSummary, deleteStoredLead, LeadData } from '../utils/conversionTracker';

interface MarketingAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MarketingAnalyticsModal({ isOpen, onClose }: MarketingAnalyticsModalProps) {
  const [stats, setStats] = useState<ConversionSummary | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const reloadStats = () => {
    setStats(getStoredConversions());
  };

  useEffect(() => {
    if (isOpen) {
      reloadStats();
    }

    const handleUpdate = () => {
      reloadStats();
    };

    window.addEventListener('ptkgr_marketing_data_updated', handleUpdate);
    return () => {
      window.removeEventListener('ptkgr_marketing_data_updated', handleUpdate);
    };
  }, [isOpen]);

  if (!isOpen || !stats) return null;

  const handleReset = () => {
    if (window.confirm('Apakah Anda yakin ingin mereset seluruh data statistik konversi dan data lead ini?')) {
      if (typeof window.__resetMarketingStats === 'function') {
        window.__resetMarketingStats();
      } else {
        localStorage.removeItem('ptkgr_marketing_conversions_v1');
      }
      reloadStats();
    }
  };

  const handleDeleteLead = (leadId: string, leadName: string) => {
    if (window.confirm(`Hapus data lead dari "${leadName}"?`)) {
      deleteStoredLead(leadId);
      reloadStats();
    }
  };

  const handleCopyLead = (lead: LeadData) => {
    const text = `Lead: ${lead.name} | HP: ${lead.phone} | Layanan: ${lead.serviceName || lead.service} | Estimasi: ${lead.estimatedPriceDisplay || '-'} | Waktu: ${new Date(lead.timestamp).toLocaleString('id-ID')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sourceLabels: Record<string, string> = {
    hero_cta: 'Hero Section (Hubungi Sekarang)',
    hero_instant_estimate: 'Hero Section (Tombol Estimasi Instan)',
    header_instant_estimate: 'Header (Tombol Estimasi Instan)',
    price_section_instant_estimate: 'Section Tarif (Tombol Estimasi Instan)',
    instant_estimate_button: 'Tombol Estimasi Instan (3-Step Lead Form)',
    mobile_floating_bar: 'Floating Action Bar (Mobile)',
    floating_desktop_wa: 'Tombol Floating WA Kanan (Desktop)',
    floating_desktop_wa_left: 'Tombol Floating WA Kiri (Desktop)',
    header_wa_button: 'Tombol Header Atas',
    price_estimator_form: 'Kalkulator Estimasi Biaya',
    gallery_modal_cta: 'Galeri Foto Lapangan',
    service_detail_modal: 'Modal Detail Layanan',
    area_checker_order: 'Area Layanan (Kecamatan)',
    final_cta_section: 'Section Bawah (Final CTA)',
    general_whatsapp_link: 'Link WhatsApp Umum',
    general_phone_link: 'Link Telepon Langsung'
  };

  const cleanPhoneForWa = (phone: string) => {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    if (!clean.startsWith('62')) clean = '62' + clean;
    return clean;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col text-[#0A192F]"
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
              <p className="text-xs text-cyan-200">PT Kusuma Gemilang Raya • Lead Generation & Interaksi Klien</p>
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-[#E0F7F9]/50 p-4 rounded-2xl border border-[#00C2CB]/30">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Klik WhatsApp</span>
              <div className="text-2xl sm:text-3xl font-black text-[#0A192F] flex items-center gap-2">
                <span>{stats.totalWhatsAppClicks}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold">WA</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Chat calon klien</p>
            </div>

            <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Panggilan Telepon</span>
              <div className="text-2xl sm:text-3xl font-black text-[#FF6B00] flex items-center gap-2">
                <span>{stats.totalPhoneCalls}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-100 text-[#FF6B00] font-bold">Call</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Dial telepon</p>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-300 shadow-xs">
              <span className="text-[11px] font-bold text-emerald-700 block mb-1">Lead Formulir</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-800 flex items-center gap-2">
                <span>{stats.totalLeadsGenerated || 0}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-200 text-emerald-800 font-bold">Instan</span>
              </div>
              <p className="text-[10px] text-emerald-600 mt-1">Form 3-langkah</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 block mb-1">Total Konversi</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-800">
                {stats.totalConversions}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Akumulasi interaksi</p>
            </div>

          </div>

          {/* Section: Data Lead Formulir Masuk (Lead Generation) */}
          <div className="bg-gradient-to-br from-slate-50 to-[#F1F8F9] p-5 rounded-3xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00C2CB]" />
                <h4 className="text-sm font-extrabold text-[#0A192F] uppercase tracking-wider">
                  Daftar Lead Masuk (Formulir Estimasi Instan):
                </h4>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-white font-bold text-slate-600 border border-slate-200 shadow-2xs">
                {stats.leads?.length || 0} Lead Tersimpan
              </span>
            </div>

            {(!stats.leads || stats.leads.length === 0) ? (
              <div className="p-6 bg-white rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Belum ada formulir estimasi yang dikirimkan.</p>
                <p>Klik tombol <strong>"Dapatkan Estimasi Instan"</strong> di website untuk mencoba alur form 3 langkah dan melihat lead tersimpan di sini secara otomatis.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {stats.leads.map((lead) => {
                  const waNumber = cleanPhoneForWa(lead.phone);
                  const scheduleInfo = lead.preferredSchedule 
                    ? ` Rencana jadwal yang diajukan: ${lead.preferredSchedule}${lead.preferredTimeSlot ? ` (${lead.preferredTimeSlot})` : ''}. Apakah armada kami dapat dikonfirmasi untuk waktu tersebut?`
                    : ' Apakah ada jadwal pengerjaan yang diinginkan?';
                  const waMessage = encodeURIComponent(`Halo Bapak/Ibu ${lead.name}, terima kasih telah mengajukan estimasi instan jasa sanitasi (${lead.serviceName || lead.service}) di PT Kusuma Gemilang Raya.${scheduleInfo}`);
                  const waChatUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

                  return (
                    <div 
                      key={lead.id} 
                      className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-[#00C2CB]/50 transition-all text-xs space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-[#0A192F] text-sm">{lead.name}</span>
                          {lead.propertyType && (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-semibold">
                              {lead.propertyType}
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-cyan-50 text-[#008c94] border border-[#00C2CB]/30 rounded-full text-[10px] font-bold">
                            {lead.serviceName || lead.service}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(lead.timestamp).toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-600">
                        <div>
                          <strong className="text-slate-800">No. WhatsApp/HP:</strong> {lead.phone}
                        </div>
                        <div>
                          <strong className="text-slate-800">Estimasi Biaya:</strong>{' '}
                          <span className="font-bold text-[#FF6B00]">
                            {lead.estimatedPriceDisplay || 'Menunggu Analisis'}
                          </span>
                        </div>
                        {lead.district && (
                          <div>
                            <strong className="text-slate-800">Lokasi:</strong> {lead.district}
                          </div>
                        )}
                        {lead.volumeEstimate && (
                          <div>
                            <strong className="text-slate-800">Perkiraan Volume:</strong> {lead.volumeEstimate}
                          </div>
                        )}
                        {lead.preferredSchedule && (
                          <div className="sm:col-span-2 flex items-center gap-1.5 p-2 bg-[#E0F7F9]/40 border border-[#00C2CB]/30 rounded-xl text-slate-700">
                            <Calendar className="w-3.5 h-3.5 text-[#008c94] shrink-0" />
                            <div>
                              <strong className="text-[#0A192F]">Rencana Jadwal (Booking):</strong>{' '}
                              <span className="font-bold text-[#008c94]">{lead.preferredSchedule}</span>
                              {lead.preferredTimeSlot && (
                                <span className="ml-1 text-slate-500 font-medium">({lead.preferredTimeSlot})</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {lead.notes && (
                        <div className="p-2 bg-slate-50 rounded-lg text-slate-500 italic text-[11px]">
                          "{lead.notes}"
                        </div>
                      )}

                      {/* Action buttons per lead */}
                      <div className="flex items-center justify-between pt-1 gap-2">
                        <div className="flex items-center gap-2">
                          <a 
                            href={waChatUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-colors shadow-2xs"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Follow Up WA</span>
                          </a>

                          <a 
                            href={`tel:${lead.phone}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                          >
                            <PhoneCall className="w-3 h-3 text-[#FF6B00]" />
                            <span>Telepon</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyLead(lead)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Salin Data Lead"
                          >
                            {copiedId === lead.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteLead(lead.id, lead.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Hapus Lead"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Breakdown per Tombol / Sumber */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#0A192F] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00C2CB]" />
              Distribusi Sumber Tombol yang Menghasilkan Lead:
            </h4>

            {Object.keys(stats.sourceBreakdown).length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                Belum ada klik tombol yang tercatat pada sesi ini.
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
              <strong>Kompatibilitas Google Analytics / GA4:</strong> Setiap formulir estimasi yang dikirim memicu event <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">generate_lead</code> ke <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">window.dataLayer</code> & <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">gtag</code>. Data otomatis tersimpan di Local Marketing Data.
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
            <span>Reset Data Evaluasi & Leads</span>
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
