import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  FileCheck, 
  Building2, 
  Droplets, 
  X, 
  ArrowRight,
  Info
} from 'lucide-react';
import { CONTACT_INFO, SANITATION_PARTNERS, SanitationPartner } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

// Custom SVG Emblems for official associations & government bodies
const PartnerEmblem: React.FC<{ type: SanitationPartner['iconType']; className?: string }> = ({ type, className = "w-10 h-10" }) => {
  switch (type) {
    case 'association':
      // APSI (Asosiasi Pengusaha Sanitasi Indonesia)
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" fill="none">
            <circle cx="24" cy="24" r="22" className="fill-[#00C2CB]/15 stroke-[#00C2CB]" strokeWidth="2.5" />
            <path d="M24 6L36 12V24C36 31.5 24 40 24 40C24 40 12 31.5 12 24V12L24 6Z" className="fill-[#0A192F] stroke-[#00C2CB]" strokeWidth="2" />
            {/* Water drop & hygiene sparkle inside shield */}
            <path d="M24 14C24 14 18 21.5 18 25.5C18 28.8 20.7 31.5 24 31.5C27.3 31.5 30 28.8 30 25.5C30 21.5 24 14 24 14Z" className="fill-[#00C2CB]" />
            <path d="M22 22C21.5 23 21 24.5 21 26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="28" cy="18" r="1.5" fill="#FFD700" />
            <circle cx="31" cy="21" r="1" fill="#FFD700" />
          </svg>
        </div>
      );
    case 'dlh':
      // IPLT Sumur Batu - DLH Bekasi (Eco & Government Waste Treatment)
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" fill="none">
            <rect x="4" y="4" width="40" height="40" rx="10" className="fill-emerald-950/60 stroke-emerald-500" strokeWidth="2" />
            {/* Eco Leaf & Water cycle */}
            <path d="M24 10C16 10 12 17 12 25C12 33 20 37 24 37C28 37 36 33 36 25C36 17 32 10 24 10Z" className="fill-emerald-900/40 stroke-emerald-400" strokeWidth="1.5" />
            <path d="M24 12V34M16 22L24 28L32 20" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="24" r="5" className="fill-emerald-400" />
            <path d="M22 24L23.5 25.5L26 23" stroke="#064E3B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'oss':
      // OSS RBA - KBLI 37011 Pemerintah RI
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" fill="none">
            <circle cx="24" cy="24" r="21" className="fill-sky-950/70 stroke-sky-400" strokeWidth="2" />
            {/* Institutional pillars & seal */}
            <path d="M12 34H36M15 34V20M21 34V20M27 34V20M33 34V20M12 20L24 11L36 20H12Z" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24" cy="16" r="2" fill="#FBBF24" />
            <rect x="18" y="34" width="12" height="4" rx="1" fill="#38BDF8" />
          </svg>
        </div>
      );
    case 'safety':
      // K3 Keselamatan & Kesehatan Kerja
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" fill="none">
            {/* Gear circle of K3 */}
            <circle cx="24" cy="24" r="21" className="fill-amber-950/60 stroke-amber-400" strokeWidth="2" strokeDasharray="6 3" />
            <circle cx="24" cy="24" r="16" className="fill-amber-900/30 stroke-amber-500" strokeWidth="1.5" />
            {/* Cross emblem */}
            <path d="M21 14H27V21H34V27H27V34H21V27H14V21H21V14Z" className="fill-amber-400 stroke-amber-300" strokeWidth="1" />
          </svg>
        </div>
      );
    case 'standard':
      // ASPEP & Standar Baku Mutu Permen LHK
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" fill="none">
            <path d="M24 4L29.5 15.5L42 17.5L33 26.5L35 39L24 33L13 39L15 26.5L6 17.5L18.5 15.5L24 4Z" className="fill-cyan-950/70 stroke-cyan-400" strokeWidth="2" />
            <circle cx="24" cy="24" r="8" className="fill-[#0A192F] stroke-cyan-300" strokeWidth="1.5" />
            <path d="M21 24L23 26L27 22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    case 'industry':
      // Rekanan Kawasan Industri Bekasi
      return (
        <div className={`relative flex items-center justify-center ${className}`}>
          <svg viewBox="0 0 48 48" className="w-full h-full drop-shadow-sm" fill="none">
            <rect x="5" y="5" width="38" height="38" rx="8" className="fill-indigo-950/70 stroke-indigo-400" strokeWidth="2" />
            <path d="M12 36V22L20 27V22L28 27V16L36 21V36H12Z" className="fill-indigo-900/40 stroke-indigo-300" strokeWidth="1.5" />
            <circle cx="34" cy="14" r="4" className="fill-indigo-500/80" />
            <path d="M32.5 14L33.5 15L35.5 13" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
    default:
      return <Award className={`${className} text-[#00C2CB]`} />;
  }
};

export const SanitationPartnersBanner: React.FC = () => {
  const [selectedPartner, setSelectedPartner] = useState<SanitationPartner | null>(null);

  const handlePartnerClick = (partner: SanitationPartner) => {
    setSelectedPartner(partner);
    trackConversion('whatsapp_click', 'partner_card_modal_view', {
      partnerId: partner.id,
      partnerName: partner.name
    });
  };

  const handleContactAboutLegal = (partnerName: string) => {
    const waUrl = `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
      `Halo PT Kusuma Gemilang Raya, saya ingin menanyakan bukti legalitas operasional dan kemitraan resmi (${partnerName}) untuk pengerjaan sanitasi.`
    )}`;
    trackConversion('whatsapp_click', 'partner_legal_whatsapp_inquiry', { partnerName });
    window.open(waUrl, '_blank');
  };

  return (
    <section 
      id="mitra-asosiasi" 
      aria-label="Mitra & Asosiasi Jasa Sanitasi"
      className="relative bg-gradient-to-b from-[#0A192F] via-[#0E2442] to-[#0A192F] text-white py-12 border-t border-b border-slate-800 overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00C2CB]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner Strip Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#00C2CB] text-xs font-bold tracking-wide uppercase mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Kredibilitas, Afiliasi & Regulasi Resmi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Mitra & Asosiasi Jasa Sanitasi
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Didukung sertifikasi resmi, afiliasi asosiasi sanitasi, dan pembuangan limbah berizin IPLT Bekasi untuk menjamin layanan bebas pencemaran lingkungan.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-400 bg-slate-800/80 border border-slate-700/80 px-3.5 py-2 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Standar Baku Mutu Permen LHK & K3 Terverifikasi</span>
          </div>
        </div>

        {/* Logo & Association Strip Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {SANITATION_PARTNERS.map((partner) => (
            <button
              key={partner.id}
              onClick={() => handlePartnerClick(partner)}
              className="group relative flex flex-col items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/60 hover:border-[#00C2CB]/50 transition-all duration-200 text-center hover:shadow-lg hover:shadow-[#00C2CB]/5 hover:-translate-y-0.5 cursor-pointer"
            >
              {/* Partner Emblem / Logo Icon */}
              <div className="mb-2.5 transition-transform duration-200 group-hover:scale-110">
                <PartnerEmblem type={partner.iconType} className="w-12 h-12" />
              </div>

              {/* Acronym / Short Name */}
              <div className="space-y-1 w-full">
                <span className="block text-xs sm:text-sm font-black text-white tracking-tight group-hover:text-[#00C2CB] transition-colors line-clamp-1">
                  {partner.shortName}
                </span>
                
                {/* Category Micro Badge */}
                <span className="inline-block text-[10px] text-slate-400 font-medium line-clamp-1">
                  {partner.category}
                </span>
              </div>

              {/* Status Badge */}
              <div className="mt-2.5 pt-2 border-t border-slate-700/60 w-full">
                <span className="inline-flex items-center justify-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full w-full">
                  <CheckCircle2 className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{partner.badgeText}</span>
                </span>
              </div>

              {/* Click info hint */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Info className="w-3 h-3 text-[#00C2CB]" />
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Trust Highlights Ticker / Strip */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-[#00C2CB]" />
              <span>100% Berbadan Hukum PT Resmi</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pembuangan Resmi IPLT Sumur Batu</span>
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Faktur Pajak SPPKP & Dokumen Manifest</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            Klik logo untuk melihat rincian kepatuhan & legalitas resmi
          </div>
        </div>
      </div>

      {/* Modal Detail Kemitraan & Asosiasi */}
      {selectedPartner && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedPartner(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-[#0E2442] border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              aria-label="Tutup Detail"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="shrink-0 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <PartnerEmblem type={selectedPartner.iconType} className="w-14 h-14" />
              </div>
              <div className="pr-6">
                <span className="inline-block text-[11px] font-bold text-[#00C2CB] uppercase tracking-wider mb-1">
                  {selectedPartner.category}
                </span>
                <h3 className="text-xl font-black text-white leading-tight">
                  {selectedPartner.name}
                </h3>
                <span className="inline-flex items-center gap-1 mt-1 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {selectedPartner.badgeText}
                </span>
              </div>
            </div>

            {/* Credential Number / Keterangan Legal */}
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/80 mb-4">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                Registrasi & Kepatuhan Legal
              </div>
              <div className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#00C2CB] shrink-0" />
                <span>{selectedPartner.credentialNumber}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-6">
              <p>{selectedPartner.description}</p>
              
              <div className="p-3 rounded-lg bg-[#00C2CB]/10 border border-[#00C2CB]/25 text-xs text-cyan-200">
                <strong className="block font-bold text-white mb-1">Kenapa ini penting bagi Anda?</strong>
                Dengan kepatuhan ini, PT Kusuma Gemilang Raya menjamin limbah domestik dan industri disalurkan ke fasilitas pemrosesan resmi berizin, tidak mencemari selokan/sungai permukiman warga, dan aman dari sanksi dinas lingkungan.
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={() => handleContactAboutLegal(selectedPartner.name)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm transition-all shadow-md"
              >
                <span>Tanya Legalitas via WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedPartner(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-colors border border-slate-700"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SanitationPartnersBanner;
