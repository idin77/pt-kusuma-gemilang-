import React, { useState } from 'react';
import { 
  Calculator, 
  Sparkles, 
  X, 
  User, 
  Phone, 
  Wrench, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Send, 
  ShieldCheck, 
  Clock, 
  FileText, 
  Building2, 
  Home, 
  Factory,
  ChevronRight,
  PhoneCall,
  Calendar
} from 'lucide-react';
import { CONTACT_INFO, KOTA_BEKASI, KAB_BEKASI } from '../data/websiteData';
import { saveLeadToMarketing, LeadData } from '../utils/conversionTracker';

export interface InstantEstimateButtonProps {
  buttonText?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'header' | 'outline' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  source?: string;
  showIcon?: boolean;
  onEstimateSubmitted?: (lead: LeadData) => void;
}

interface ServiceOption {
  id: string;
  title: string;
  category: string;
  baseRate: number;
  rateUnit: string;
  description: string;
  allowManifest: boolean;
  badge?: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'sedot_wc',
    title: 'Sedot WC / Septic Tank Penuh',
    category: 'Black Water',
    baseRate: 500000,
    rateUnit: 'per m³',
    description: 'Pengurasan septic tank sampai tuntas, bersih tanpa bau menyengat.',
    allowManifest: true,
    badge: 'Paling Populer'
  },
  {
    id: 'sedot_lemak',
    title: 'Sedot Grease Trap / Lemak Dapur',
    category: 'Grey Water',
    baseRate: 900000,
    rateUnit: 'per m³',
    description: 'Pembersihan endapan minyak & lemak untuk resto, kafe, dan katering.',
    allowManifest: true
  },
  {
    id: 'sedot_stp',
    title: 'Sedot Limbah Cair STP & Pabrik',
    category: 'Grey Water & Industri',
    baseRate: 900000,
    rateUnit: 'per m³',
    description: 'Pengurasan lumpur aktif & limbah instalasi STP ruko, hotel, dan pabrik.',
    allowManifest: true,
    badge: 'Komersial'
  },
  {
    id: 'pipa_mampet',
    title: 'Pelancaran Saluran Pipa Mampet',
    category: 'Saluran Tersumbat',
    baseRate: 450000,
    rateUnit: 'per titik',
    description: 'Penanganan pipa wastafel, floor drain, & kloset tanpa bongkar lantai.',
    allowManifest: false
  },
  {
    id: 'manifest_iplt',
    title: 'Limbah Resmi + Manifest IPLT DLH',
    category: 'Legalitas IPLT',
    baseRate: 900000,
    rateUnit: 'per m³',
    description: 'Termasuk bukti setor limbah resmi ke IPLT Sumur Batu Bekasi.',
    allowManifest: true,
    badge: 'Resmi & Valid'
  }
];

const PROPERTY_TYPES = [
  { id: 'rumah', label: 'Rumah / Perumahan', icon: Home },
  { id: 'ruko_resto', label: 'Ruko / Resto / Usaha', icon: Building2 },
  { id: 'pabrik_kantor', label: 'Pabrik / Kawasan Industri', icon: Factory }
];

const VOLUME_OPTIONS = [
  { id: '1-2', label: '1 - 2 Kubik (m³)', desc: 'Ukuran septic tank rumah standar', multiplier: 2 },
  { id: '3-4', label: '3 - 4 Kubik (m³)', desc: 'Septic tank besar / ruko bertingkat', multiplier: 3.5 },
  { id: '5-6', label: '5 - 6 Kubik (m³)', desc: '1 Tangki mobil tangki penuh', multiplier: 5.5 },
  { id: 'cek', label: 'Belum Tahu (Perlu Cek)', desc: 'Teknisi akan mengukur di tempat', multiplier: 2 }
];

export default function InstantEstimateButton({
  buttonText = 'Dapatkan Estimasi Instan',
  className = '',
  variant = 'primary',
  size = 'md',
  source = 'instant_estimate_button',
  showIcon = true,
  onEstimateSubmitted
}: InstantEstimateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [name, setName] = useState('');
  const [propertyType, setPropertyType] = useState('rumah');
  const [district, setDistrict] = useState('Bekasi Barat');
  
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [selectedServiceId, setSelectedServiceId] = useState('sedot_wc');
  const [selectedVolume, setSelectedVolume] = useState('1-2');
  const [withManifest, setWithManifest] = useState(false);
  const [preferredSchedule, setPreferredSchedule] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Pagi (08:00 - 12:00)');
  const [notes, setNotes] = useState('');

  // Result state
  const [submittedLead, setSubmittedLead] = useState<LeadData | null>(null);

  // Default minimum date string (Hari ini)
  const todayStr = new Date().toISOString().split('T')[0];

  // Quick preset helper
  const setQuickDate = (daysFromToday: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromToday);
    setPreferredSchedule(d.toISOString().split('T')[0]);
  };

  // Helper formatted date display
  const formatIndonesianDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Reset or initialize modal
  const handleOpenModal = () => {
    setStep(1);
    setPhoneError('');
    if (!preferredSchedule) {
      // Default to today
      setPreferredSchedule(todayStr);
    }
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  // Step 1 Validation
  const handleNextFromStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setStep(2);
  };

  // Step 2 Validation
  const handleNextFromStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = phone.replace(/\D/g, '');
    if (clean.length < 9 || clean.length > 14) {
      setPhoneError('Nomor telepon/WhatsApp minimal 10 digit dan valid.');
      return;
    }
    setPhoneError('');
    setStep(3);
  };

  // Calculate pricing
  const currentService = SERVICE_OPTIONS.find(s => s.id === selectedServiceId) || SERVICE_OPTIONS[0];
  const currentVol = VOLUME_OPTIONS.find(v => v.id === selectedVolume) || VOLUME_OPTIONS[0];
  
  let estimatedTotal = 0;
  let estimatedDisplay = '';

  if (currentService.id === 'pipa_mampet') {
    estimatedTotal = 450000;
    estimatedDisplay = 'Mulai Rp 450.000 / titik';
  } else {
    const base = currentService.baseRate;
    const manifestAddon = (withManifest && currentService.allowManifest) ? 400000 : 0;
    const ratePerCubic = base + manifestAddon;
    estimatedTotal = ratePerCubic * currentVol.multiplier;
    estimatedDisplay = `± Rp ${estimatedTotal.toLocaleString('id-ID')} (Rp ${ratePerCubic.toLocaleString('id-ID')} / m³)`;
  }

  // Step 3 Submission
  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedScheduleDisplay = preferredSchedule 
      ? formatIndonesianDate(preferredSchedule) 
      : 'Segera / Secepatnya';

    const leadRecord = saveLeadToMarketing({
      name: name.trim(),
      phone: phone.trim(),
      service: currentService.id,
      serviceName: currentService.title,
      propertyType: PROPERTY_TYPES.find(p => p.id === propertyType)?.label || propertyType,
      volumeEstimate: currentVol.label + (withManifest ? ' + Manifest IPLT' : ''),
      district: `${district}, Bekasi`,
      preferredSchedule: formattedScheduleDisplay,
      preferredTimeSlot: preferredTimeSlot,
      notes: notes.trim(),
      estimatedPriceDisplay: estimatedDisplay,
      estimatedPrice: estimatedTotal,
      source
    });

    setSubmittedLead(leadRecord);
    setStep(4);

    if (onEstimateSubmitted) {
      onEstimateSubmitted(leadRecord);
    }
  };

  // Formatting WhatsApp Redirect URL with details
  const getWhatsAppLeadUrl = () => {
    if (!submittedLead) return `https://wa.me/${CONTACT_INFO.phoneRaw}`;

    const text = 
`Halo *PT KUSUMA GEMILANG RAYA*,
Saya telah mengisi form *Estimasi Instan*:

👤 *Nama:* ${submittedLead.name}
📱 *No. WhatsApp:* ${submittedLead.phone}
🏢 *Tipe Properti:* ${submittedLead.propertyType || 'Rumah/Gedung'}
📍 *Lokasi:* ${submittedLead.district || 'Bekasi'}
🛠️ *Layanan:* ${submittedLead.serviceName}
📦 *Volume Kebutuhan:* ${submittedLead.volumeEstimate}
📅 *Rencana Jadwal (Booking):* ${submittedLead.preferredSchedule || 'Secepatnya'} (${submittedLead.preferredTimeSlot || 'Pagi'})
💰 *Estimasi Biaya:* ${submittedLead.estimatedPriceDisplay}
${submittedLead.notes ? `📝 *Catatan:* ${submittedLead.notes}\n` : ''}
Mohon info ketersediaan armada terdekat ke alamat kami. Terima kasih!`;

    return `https://wa.me/${CONTACT_INFO.phoneRaw}?text=${encodeURIComponent(text)}`;
  };

  // Styling variant definitions
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-[#FF6B00] hover:bg-[#E65F00] text-white shadow-lg hover:shadow-orange-500/25';
      break;
    case 'secondary':
      variantClasses = 'bg-[#00C2CB] hover:bg-[#00A0A8] text-white shadow-md hover:shadow-cyan-500/25';
      break;
    case 'accent':
      variantClasses = 'bg-gradient-to-r from-[#FF6B00] to-[#FF8533] hover:from-[#E65F00] hover:to-[#FF6B00] text-white shadow-lg';
      break;
    case 'header':
      variantClasses = 'bg-gradient-to-r from-[#00C2CB] to-[#008c94] hover:brightness-110 text-white shadow-md border border-white/20';
      break;
    case 'outline':
      variantClasses = 'bg-white hover:bg-slate-50 text-[#0A192F] border-2 border-[#0A192F] shadow-xs';
      break;
    case 'pulse':
      variantClasses = 'bg-[#FF6B00] hover:bg-[#E65F00] text-white shadow-lg animate-pulse';
      break;
    default:
      variantClasses = 'bg-[#FF6B00] hover:bg-[#E65F00] text-white shadow-lg';
  }

  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'px-3.5 py-1.5 text-xs font-bold';
      break;
    case 'lg':
      sizeClasses = 'px-8 py-4 text-base font-black';
      break;
    case 'md':
    default:
      sizeClasses = 'px-5 py-3 text-sm font-bold';
      break;
  }

  return (
    <>
      {/* Trigger Button Component */}
      <button
        type="button"
        onClick={handleOpenModal}
        data-cta-source={source}
        className={`inline-flex items-center justify-center gap-2 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer select-none ${variantClasses} ${sizeClasses} ${className}`}
        aria-label="Buka Formulir Estimasi Biaya Instan"
      >
        {showIcon && <Calculator className="w-4 h-4 shrink-0 text-white/90" />}
        <span>{buttonText}</span>
        <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-200" />
      </button>

      {/* 3-Step Lead Generation Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={handleCloseModal}
        >
          <div 
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[94vh] flex flex-col text-[#0A192F] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0A192F] via-[#102A4C] to-[#0A192F] text-white relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00C2CB]/20 border border-[#00C2CB]/30 flex items-center justify-center text-[#00C2CB]">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black tracking-tight">Dapatkan Estimasi Instan</h3>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-[#FF6B00] text-white rounded-full">
                        3 Langkah Cepat
                      </span>
                    </div>
                    <p className="text-xs text-cyan-200">PT Kusuma Gemilang Raya • Hitungan Transparan & Respon Cepat</p>
                  </div>
                </div>

                <button 
                  onClick={handleCloseModal}
                  className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                  aria-label="Tutup form"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Step Progress Indicators */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 1 ? 'bg-[#00C2CB]' : 'bg-white/20'}`} />
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 2 ? 'bg-[#00C2CB]' : 'bg-white/20'}`} />
                <div className={`h-1.5 rounded-full transition-all duration-300 ${step >= 3 ? 'bg-[#00C2CB]' : 'bg-white/20'}`} />
              </div>

              <div className="flex justify-between text-[11px] font-bold text-slate-300 mt-2 px-1">
                <span className={step === 1 ? 'text-[#00C2CB]' : ''}>1. Data Diri</span>
                <span className={step === 2 ? 'text-[#00C2CB]' : ''}>2. Kontak HP</span>
                <span className={step === 3 ? 'text-[#00C2CB]' : ''}>3. Layanan & Jadwal</span>
              </div>
            </div>

            {/* Modal Body / Steps */}
            <div className="p-6 overflow-y-auto space-y-6">

              {/* STEP 1: NAMA & LOKASI PROPERTI */}
              {step === 1 && (
                <form onSubmit={handleNextFromStep1} className="space-y-5">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-wider block">Langkah 1 dari 3</span>
                    <h4 className="text-base font-black text-[#0A192F]">Siapa nama Anda atau PIC yang dapat dihubungi?</h4>
                    <p className="text-xs text-slate-500">Informasi ini digunakan teknisi untuk menyapa Anda dan verifikasi jadwal.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nama Lengkap / Nama Panggilan <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input 
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Bpk. Hendra / Ibu Ratna"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2CB] focus:bg-white font-medium"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tipe Properti / Bangunan di Lokasi:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {PROPERTY_TYPES.map((type) => {
                        const Icon = type.icon;
                        const isSelected = propertyType === type.id;
                        return (
                          <button
                            type="button"
                            key={type.id}
                            onClick={() => setPropertyType(type.id)}
                            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                              isSelected 
                                ? 'border-[#00C2CB] bg-[#E0F7F9]/60 text-[#0A192F] font-bold shadow-xs' 
                                : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                            }`}
                          >
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-[#00C2CB]' : 'text-slate-400'}`} />
                            <span className="text-[11px] leading-tight">{type.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Wilayah / Kecamatan di Bekasi:
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2CB] focus:bg-white font-medium"
                    >
                      <optgroup label="Kota Bekasi">
                        {KOTA_BEKASI.map(k => <option key={k} value={k}>{k} (Kota Bekasi)</option>)}
                      </optgroup>
                      <optgroup label="Kabupaten Bekasi">
                        {KAB_BEKASI.map(k => <option key={k} value={k}>{k} (Kab. Bekasi)</option>)}
                      </optgroup>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!name.trim()}
                      className="w-full py-3.5 px-6 rounded-full bg-[#0A192F] hover:bg-[#172A45] disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <span>Lanjut ke Langkah 2: Nomor Kontak</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: NOMOR TELEPON & WHATSAPP */}
              {step === 2 && (
                <form onSubmit={handleNextFromStep2} className="space-y-5">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-wider block">Langkah 2 dari 3</span>
                    <h4 className="text-base font-black text-[#0A192F]">Nomor WhatsApp untuk konfirmasi estimasi</h4>
                    <p className="text-xs text-slate-500">Kalkulasi dan jadwal teknisi akan dikonfirmasikan ke nomor ini.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Nomor Handphone / WhatsApp Aktif <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                      <input 
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (phoneError) setPhoneError('');
                        }}
                        placeholder="Contoh: 0812-3456-7890"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2CB] focus:bg-white font-medium tracking-wide"
                        autoFocus
                      />
                    </div>
                    {phoneError && (
                      <p className="text-xs text-red-600 mt-1.5 font-semibold">{phoneError}</p>
                    )}
                  </div>

                  {/* Trust & Privacy Guarantee Box */}
                  <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-800 space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Jaminan Privasi & Tanpa Spam</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-emerald-700">
                      Nomor Anda 100% aman dan hanya digunakan oleh tim dispatch PT Kusuma Gemilang Raya untuk memberikan info estimasi biaya sanitasi.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <Clock className="w-4 h-4 text-[#FF6B00] shrink-0" />
                    <span>Armada standby 24 jam siap meluncur ke <strong>{district}</strong> setelah konfirmasi.</span>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="py-3 px-4 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3.5 px-6 rounded-full bg-[#0A192F] hover:bg-[#172A45] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
                    >
                      <span>Lanjut ke Langkah 3: Pilih Layanan</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: PILIH LAYANAN & ESTIMASI BIAYA */}
              {step === 3 && (
                <form onSubmit={handleSubmitLead} className="space-y-5">
                  <div className="border-b border-slate-100 pb-2">
                    <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-wider block">Langkah 3 dari 3</span>
                    <h4 className="text-base font-black text-[#0A192F]">Layanan Sanitasi apa yang Anda butuhkan?</h4>
                    <p className="text-xs text-slate-500">Pilih salah satu layanan untuk mengkalkulasi estimasi biaya langsung.</p>
                  </div>

                  {/* Service selection list */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700">Pilihan Layanan:</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {SERVICE_OPTIONS.map((srv) => {
                        const isSelected = selectedServiceId === srv.id;
                        return (
                          <div
                            key={srv.id}
                            onClick={() => setSelectedServiceId(srv.id)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'border-[#00C2CB] bg-[#E0F7F9]/50 shadow-xs ring-1 ring-[#00C2CB]'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-xs text-[#0A192F]">{srv.title}</span>
                                {srv.badge && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-[#FF6B00] text-white">
                                    {srv.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 mt-0.5">{srv.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-black text-[#008c94] block">
                                Rp {srv.baseRate.toLocaleString('id-ID')}
                              </span>
                              <span className="text-[10px] text-slate-400">{srv.rateUnit}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Volume Option (if cubic rate service) */}
                  {currentService.id !== 'pipa_mampet' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">Estimasi Volume Tangki / Limbah:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {VOLUME_OPTIONS.map((vol) => {
                          const isSelected = selectedVolume === vol.id;
                          return (
                            <button
                              type="button"
                              key={vol.id}
                              onClick={() => setSelectedVolume(vol.id)}
                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#FF6B00] bg-orange-50/70 text-[#0A192F] font-bold shadow-2xs'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                              }`}
                            >
                              <div className="text-xs font-bold">{vol.label}</div>
                              <div className="text-[10px] text-slate-400 truncate">{vol.desc}</div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Optional Manifest Toggle */}
                  {currentService.allowManifest && (
                    <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                      <input 
                        type="checkbox"
                        checked={withManifest}
                        onChange={(e) => setWithManifest(e.target.checked)}
                        className="w-4 h-4 rounded text-[#00C2CB] focus:ring-[#00C2CB]"
                      />
                      <div className="text-xs flex-1">
                        <span className="font-bold text-[#0A192F] block">Sertakan Dokumen Manifest Resmi IPLT (+Rp 400.000/m³)</span>
                        <span className="text-[11px] text-slate-500">Wajib untuk audit izin lingkungan, ISO gedung, & pabrik industri.</span>
                      </div>
                    </label>
                  )}

                  {/* Preferred Schedule Calendar Date Picker */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#00C2CB]/10 text-[#008c94] flex items-center justify-center">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <label htmlFor="preferred-schedule-input" className="text-xs font-bold text-[#0A192F] block">
                            Rencana Jadwal Layanan (Preferred Schedule)
                          </label>
                          <span className="text-[11px] text-slate-500">Pilih tanggal kalender armada siap meluncur ke lokasi</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Standby 24 Jam
                      </span>
                    </div>

                    {/* Date Input with Calendar */}
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          id="preferred-schedule-input"
                          type="date"
                          min={todayStr}
                          value={preferredSchedule}
                          onChange={(e) => setPreferredSchedule(e.target.value)}
                          className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#00C2CB] focus:border-[#00C2CB] cursor-pointer"
                        />
                      </div>

                      {/* Quick Select Buttons */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-400">Pilih Cepat:</span>
                        <button
                          type="button"
                          onClick={() => setQuickDate(0)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            preferredSchedule === todayStr
                              ? 'bg-[#00C2CB] text-white shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Hari Ini (Urgent)
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickDate(1)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Besok
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickDate(2)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Lusa
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuickDate(7)}
                          className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Akhir Pekan
                        </button>
                      </div>

                      {preferredSchedule && (
                        <p className="text-[11px] text-[#008c94] font-semibold flex items-center gap-1 pt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00C2CB] shrink-0" />
                          <span>Jadwal yang dipilih: <strong>{formatIndonesianDate(preferredSchedule)}</strong></span>
                        </p>
                      )}
                    </div>

                    {/* Time Slot Selection */}
                    <div className="pt-2 border-t border-slate-200/70">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        Pilihan Jam Kedatangan Teknisi:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { slot: 'Pagi (08:00 - 12:00)', label: 'Pagi', time: '08:00 - 12:00' },
                          { slot: 'Siang (13:00 - 17:00)', label: 'Siang', time: '13:00 - 17:00' },
                          { slot: 'Malam / Darurat (24 Jam)', label: 'Malam / Darurat', time: 'Fleksibel 24 Jam' }
                        ].map((t) => (
                          <button
                            key={t.slot}
                            type="button"
                            onClick={() => setPreferredTimeSlot(t.slot)}
                            className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                              preferredTimeSlot === t.slot
                                ? 'border-[#00C2CB] bg-[#E0F7F9] text-[#0A192F] font-bold shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            <span className="block text-xs font-bold">{t.label}</span>
                            <span className="block text-[9px] text-slate-400 mt-0.5">{t.time}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Instant Estimate Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white flex items-center justify-between shadow-md">
                    <div>
                      <span className="text-[11px] text-cyan-200 block font-semibold">Total Estimasi Awal:</span>
                      <div className="text-xl font-black text-[#00C2CB] tracking-tight">
                        {estimatedDisplay}
                      </div>
                      <span className="text-[10px] text-slate-300">
                        *Sudah termasuk armada tangki vacum & tenaga kerja terlatih
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                        Garansi 30 Hari
                      </span>
                    </div>
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Catatan Tambahan / Gejala Masalah (Opsional):
                    </label>
                    <input 
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Contoh: Kloset meluap sejak kemarin / posisi septic tank di dalam garasi"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00C2CB] focus:bg-white"
                    />
                  </div>

                  {/* Form Submission Action */}
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="py-3 px-4 rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Kembali</span>
                    </button>

                    <button
                      type="submit"
                      className="flex-1 py-3.5 px-6 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-black text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Simpan & Lihat Rincian Estimasi</span>
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 4: SUCCESS & INSTANT ESTIMATE SUMMARY */}
              {step === 4 && submittedLead && (
                <div className="space-y-5 animate-fade-in text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest block mb-1">
                      ✓ Berhasil Tersimpan ke Sistem Pemasaran
                    </span>
                    <h4 className="text-xl font-black text-[#0A192F]">
                      Estimasi Instan Siap untuk {submittedLead.name}!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Terima kasih telah mempercayakan kebutuhan sanitasi Anda pada PT Kusuma Gemilang Raya.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200 text-left space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-500">Layanan:</span>
                      <span className="text-xs font-black text-[#0A192F]">{submittedLead.serviceName}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-500">Nomor WhatsApp:</span>
                      <span className="text-xs font-black text-[#0A192F]">{submittedLead.phone}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-500">Area Layanan:</span>
                      <span className="text-xs font-bold text-slate-700">{submittedLead.district}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-500">Volume / Spesifikasi:</span>
                      <span className="text-xs font-bold text-slate-700">{submittedLead.volumeEstimate}</span>
                    </div>

                    {submittedLead.preferredSchedule && (
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2 bg-[#E0F7F9]/50 -mx-2 px-2 py-1.5 rounded-xl">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#008c94]">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Rencana Jadwal (Booking):</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-black text-[#0A192F] block">
                            {submittedLead.preferredSchedule}
                          </span>
                          {submittedLead.preferredTimeSlot && (
                            <span className="text-[10px] text-slate-500">
                              {submittedLead.preferredTimeSlot}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-bold text-[#0A192F]">Estimasi Total Biaya:</span>
                      <span className="text-lg font-black text-[#FF6B00]">
                        {submittedLead.estimatedPriceDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Instant WhatsApp Action */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={getWhatsAppLeadUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Rincian ke WhatsApp Dispatch (Siap 24 Jam)</span>
                    </a>

                    <div className="grid grid-cols-2 gap-3">
                      <a
                        href={`tel:${CONTACT_INFO.phoneRaw}`}
                        className="py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-[#0A192F] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                      >
                        <PhoneCall className="w-3.5 h-3.5 text-[#FF6B00]" />
                        <span>Telepon Cepat</span>
                      </a>

                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="py-3 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Selesai & Tutup
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    ID Tiket Lead: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-600">{submittedLead.id}</code> • Tersimpan di analitik pemasaran lokal & GA4.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}
