import React, { useState } from 'react';
import { 
  Calculator, 
  Send, 
  CheckCircle2, 
  FileText, 
  Info, 
  ShieldCheck, 
  MapPin,
  Toilet,
  UtensilsCrossed,
  Fan
} from 'lucide-react';
import { CONTACT_INFO, KOTA_BEKASI, KAB_BEKASI } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

type WasteType = 'black_water' | 'grey_water' | 'cleaning_blower';
type ManifestType = 'non_manifest' | 'dengan_manifest';

interface ServiceCategory {
  id: WasteType;
  title: string;
  badge: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBgActive: string;
  iconBgInactive: string;
  iconColorActive: string;
  iconColorInactive: string;
  borderActive: string;
  bgActive: string;
  ringActive: string;
  badgeBg: string;
  badgeText: string;
  checkBg: string;
  nonManifestRate: number;
  manifestRate: number;
}

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'black_water',
    title: 'Limbah Black Water (Tinja)',
    badge: 'Septic Tank & Toilet',
    desc: 'Sedot WC & septic tank rumah tangga, ruko, & perkantoran',
    icon: Toilet,
    iconBgActive: 'bg-[#00C2CB] text-white shadow-md ring-2 ring-[#00C2CB]/30',
    iconBgInactive: 'bg-cyan-50/80 text-[#008c94] group-hover:bg-cyan-100/90',
    iconColorActive: 'text-white',
    iconColorInactive: 'text-[#008c94]',
    borderActive: 'border-[#00C2CB]',
    bgActive: 'bg-[#E0F7F9]/40',
    ringActive: 'ring-2 ring-[#00C2CB]/20',
    badgeBg: 'bg-[#00C2CB]/20',
    badgeText: 'text-[#0A192F]',
    checkBg: 'bg-[#00C2CB]',
    nonManifestRate: 700000,
    manifestRate: 1100000,
  },
  {
    id: 'grey_water',
    title: 'Limbah Grey Water (Lumpur, Lemak)',
    badge: 'STP & Grease Trap',
    desc: 'Sedot lemak resto, bak kontrol, lumpur limbah cair, & saluran STP',
    icon: UtensilsCrossed,
    iconBgActive: 'bg-[#FF6B00] text-white shadow-md ring-2 ring-[#FF6B00]/30',
    iconBgInactive: 'bg-orange-50/80 text-[#FF6B00] group-hover:bg-orange-100/90',
    iconColorActive: 'text-white',
    iconColorInactive: 'text-[#FF6B00]',
    borderActive: 'border-[#FF6B00]',
    bgActive: 'bg-[#FF6B00]/5',
    ringActive: 'ring-2 ring-[#FF6B00]/20',
    badgeBg: 'bg-[#FF6B00]/20',
    badgeText: 'text-[#FF6B00]',
    checkBg: 'bg-[#FF6B00]',
    nonManifestRate: 1100000,
    manifestRate: 1500000,
  },
  {
    id: 'cleaning_blower',
    title: 'Cleaning / Blower Lumpur',
    badge: 'Spesialis Kerak Keras',
    desc: 'Blower pengencer lumpur beku, kuras endapan lumpur padat & kerak',
    icon: Fan,
    iconBgActive: 'bg-[#008c94] text-white shadow-md ring-2 ring-[#008c94]/30',
    iconBgInactive: 'bg-teal-50/80 text-[#008c94] group-hover:bg-teal-100/90',
    iconColorActive: 'text-white',
    iconColorInactive: 'text-[#008c94]',
    borderActive: 'border-[#008c94]',
    bgActive: 'bg-[#00C2CB]/10',
    ringActive: 'ring-2 ring-[#00C2CB]/20',
    badgeBg: 'bg-[#008c94]/20',
    badgeText: 'text-[#008c94]',
    checkBg: 'bg-[#008c94]',
    nonManifestRate: 1100000,
    manifestRate: 1500000,
  },
];

export default function PriceEstimator() {
  const [wasteType, setWasteType] = useState<WasteType>('black_water');
  const [manifestOption, setManifestOption] = useState<ManifestType>('non_manifest');
  const [volume, setVolume] = useState<number>(2); // in kubik (m3)
  const [district, setDistrict] = useState('Bekasi Barat');
  const [hoseAccess, setHoseAccess] = useState<'standar' | 'panjang'>('standar');
  const [urgency, setUrgency] = useState<'segera' | 'terjadwal'>('segera');
  const [notes, setNotes] = useState('');

  // Official updated pricing:
  // 1. Limbah Black Water (Tinja): Rp 700.000/kubik non manifest | Rp 1.100.000/kubik manifest (+Rp 400.000)
  // 2. Limbah Grey Water (Lumpur, Lemak): Rp 1.100.000/kubik non manifest | Rp 1.500.000/kubik manifest (+Rp 400.000)
  // 3. Cleaning / Blower Lumpur: Rp 1.100.000/kubik non manifest | Rp 1.500.000/kubik manifest (+Rp 400.000)
  const baseRatePerCubic = 
    wasteType === 'black_water' 
      ? 700000 
      : (wasteType === 'grey_water' ? 1100000 : 1100000);

  const manifestFeePerCubic = manifestOption === 'dengan_manifest' ? 400000 : 0;
  const totalRatePerCubic = baseRatePerCubic + manifestFeePerCubic;
  const totalPrice = totalRatePerCubic * volume;

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const wasteLabel = 
      wasteType === 'black_water' 
        ? 'Limbah Black Water (Tinja / Septic Tank)' 
        : wasteType === 'grey_water'
          ? 'Limbah Grey Water (Lumpur, Lemak / STP / Grease Trap)'
          : 'Cleaning / Blower Lumpur (Pengenceran Kerak Keras & Lumpur Padat)';
    
    const manifestLabel = manifestOption === 'dengan_manifest' 
      ? 'Dengan Dokumen Manifest Resmi (+Rp 400.000/kubik)' 
      : 'Non Manifest (Standar)';

    const hoseLabel = hoseAccess === 'panjang' 
      ? 'Akses Jarak Jauh / Masuk Gang (> 30m)' 
      : 'Akses Standar (< 30m dari mobil)';

    const message = 
`Halo *PT KUSUMA GEMILANG RAYA*,
Saya ingin order & booking layanan sedot limbah di Bekasi:

📋 *Jenis Layanan:* ${wasteLabel}
📦 *Estimasi Volume:* ${volume} Kubik (m³)
📄 *Dokumen:* ${manifestLabel}
💰 *Tarif Satuan:* Rp ${totalRatePerCubic.toLocaleString('id-ID')} / kubik
💵 *Total Estimasi Biaya:* Rp ${totalPrice.toLocaleString('id-ID')}
📍 *Lokasi/Kecamatan:* ${district}, Bekasi
📏 *Akses Selang:* ${hoseLabel}
⏱️ *Waktu Pengerjaan:* ${urgency === 'segera' ? 'Butuh Segera / Hari Ini' : 'Dapat Dijadwalkan'}
${notes ? `📝 *Catatan:* ${notes}\n` : ''}
Mohon konfirmasi ketersediaan armada ke lokasi kami. Terima kasih!`;

    trackConversion('whatsapp_click', 'price_estimator_form', {
      wasteType,
      volume,
      manifestOption,
      district,
      totalPrice
    });

    const waLink = `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0A192F] to-[#172A45] p-6 sm:p-7 text-white">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#00C2CB]/20 flex items-center justify-center text-[#00C2CB] shrink-0">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Kalkulator Estimasi Biaya & Booking Cepat</h3>
            <p className="text-xs sm:text-sm text-cyan-200 mt-0.5">
              Tarif resmi transparan per kubik untuk Limbah Black Water, Grey Water, & Cleaning/Blower Lumpur (Bekasi)
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSendToWhatsApp} className="p-6 sm:p-8 space-y-6">
        
        {/* Step 1: Pilih Jenis Layanan / Limbah */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
              <span>1. Pilih Jenis Limbah & Layanan:</span>
            </label>
            <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
              Ikon berbeda untuk identifikasi visual cepat
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = wasteType === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setWasteType(cat.id)}
                  className={`group p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer relative flex flex-col justify-between ${
                    isSelected
                      ? `${cat.borderActive} ${cat.bgActive} shadow-sm ${cat.ringActive}`
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header: Distinct Lucide Icon + Badge + Selection Check */}
                    <div className="flex items-start justify-between gap-2.5 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 ${
                            isSelected ? cat.iconBgActive : cat.iconBgInactive
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${cat.badgeBg} ${cat.badgeText}`}
                        >
                          {cat.badge}
                        </span>
                      </div>

                      {isSelected ? (
                        <span
                          className={`w-6 h-6 rounded-full ${cat.checkBg} text-white flex items-center justify-center text-xs font-black shrink-0 shadow-xs`}
                        >
                          ✓
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full border border-slate-200 bg-slate-50 group-hover:border-slate-300 shrink-0" />
                      )}
                    </div>

                    {/* Title & Description */}
                    <h4 className="font-extrabold text-base text-[#0A192F] group-hover:text-[#00C2CB] transition-colors leading-snug">
                      {cat.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  {/* Pricing Breakdown Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-[11px] text-slate-500 font-medium">Non Manifest:</span>
                      <span
                        className={`text-sm font-black ${
                          cat.id === 'black_water'
                            ? 'text-[#0A192F]'
                            : cat.id === 'grey_water'
                            ? 'text-[#FF6B00]'
                            : 'text-[#008c94]'
                        }`}
                      >
                        Rp {cat.nonManifestRate.toLocaleString('id-ID')}
                        <span className="text-[11px] font-semibold text-slate-500">/m³</span>
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-emerald-700">
                      <span className="text-[11px] font-medium">Dengan Manifest:</span>
                      <span className="text-sm font-black">
                        Rp {cat.manifestRate.toLocaleString('id-ID')}
                        <span className="text-[11px] font-semibold text-slate-500">/m³</span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Opsi Dokumen Manifest */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold text-[#0A192F] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#00C2CB]" />
              <span>2. Opsi Dokumen Manifest Pembuangan Resmi:</span>
            </label>
            <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
              Dokumen izin IPLT resmi untuk audit lingkungan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setManifestOption('non_manifest')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                manifestOption === 'non_manifest'
                  ? 'border-[#0A192F] bg-white ring-2 ring-[#0A192F]/10 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div>
                <span className="block text-sm font-bold text-[#0A192F]">
                  Non Manifest (Standar)
                </span>
                <span className="text-xs text-slate-500">
                  Untuk perumahan, kontrakan, & ruko standar
                </span>
              </div>
              <span className="text-xs font-extrabold text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                +Rp 0
              </span>
            </button>

            <button
              type="button"
              onClick={() => setManifestOption('dengan_manifest')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                manifestOption === 'dengan_manifest'
                  ? 'border-[#FF6B00] bg-white ring-2 ring-[#FF6B00]/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-600'
              }`}
            >
              <div>
                <span className="block text-sm font-bold text-[#0A192F] flex items-center gap-1.5">
                  <span>Dengan Manifest Resmi</span>
                  <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Legal IPLT
                  </span>
                </span>
                <span className="text-xs text-slate-500">
                  Lengkap dokumen manifest untuk perusahaan / pabrik
                </span>
              </div>
              <span className="text-xs font-black text-[#FF6B00] bg-[#FF6B00]/10 px-2.5 py-1 rounded-md">
                +Rp 400.000/kubik
              </span>
            </button>
          </div>
        </div>

        {/* Step 3: Estimasi Volume (Kubik / m3) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-bold text-[#0A192F]">
              3. Estimasi Volume Limbah (Kubik / m³):
            </label>
            <span className="text-sm font-black text-[#00C2CB] bg-[#00C2CB]/10 px-3 py-1 rounded-full">
              {volume} Kubik (m³)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#00C2CB]"
            />
          </div>

          {/* Quick Volume Selectors */}
          <div className="flex flex-wrap gap-2 mt-3">
            {[1, 2, 3, 4, 5, 8, 10, 12].map((vol) => (
              <button
                key={vol}
                type="button"
                onClick={() => setVolume(vol)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  volume === vol
                    ? 'bg-[#0A192F] text-white border-[#0A192F]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {vol} m³
              </button>
            ))}
            <span className="text-xs text-slate-400 self-center ml-2">
              (Kapasitas truk tangki s/d 5.000 liter / rit)
            </span>
          </div>
        </div>

        {/* Step 4: Lokasi & Akses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#0A192F] mb-1.5">
              Lokasi Kecamatan di Bekasi:
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/20 outline-none text-sm font-medium bg-white text-slate-800"
              >
                <optgroup label="Kota Bekasi">
                  {KOTA_BEKASI.map((k) => (
                    <option key={k} value={k}>Kota Bekasi - {k}</option>
                  ))}
                </optgroup>
                <optgroup label="Kabupaten Bekasi & Cikarang">
                  {KAB_BEKASI.map((k) => (
                    <option key={k} value={k}>Kab. Bekasi - {k}</option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0A192F] mb-1.5">
              Akses Parkir & Panjang Selang:
            </label>
            <select
              value={hoseAccess}
              onChange={(e) => setHoseAccess(e.target.value as 'standar' | 'panjang')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/20 outline-none text-sm font-medium bg-white text-slate-800"
            >
              <option value="standar">Parkir Depan Pagar / Jalan Utama (Selang &lt; 30m)</option>
              <option value="panjang">Masuk Gang Sempit / Selang Panjang (30m - 70m)</option>
            </select>
          </div>
        </div>

        {/* Waktu & Catatan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-[#0A192F] mb-1.5">
              Waktu Pengerjaan:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('segera')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  urgency === 'segera'
                    ? 'border-[#FF6B00] bg-[#FF6B00]/10 text-[#FF6B00]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                🚨 Butuh Segera (Hari Ini)
              </button>
              <button
                type="button"
                onClick={() => setUrgency('terjadwal')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all cursor-pointer ${
                  urgency === 'terjadwal'
                    ? 'border-[#00C2CB] bg-[#00C2CB]/10 text-[#00C2CB]'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                📅 Ingin Dijadwalkan
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0A192F] mb-1.5">
              Catatan Lokasi (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: dekat kantor kelurahan, septic tank di belakang..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:border-[#00C2CB] text-xs bg-white text-slate-800 outline-none"
            />
          </div>
        </div>

        {/* Summary Breakdown Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0A192F] to-[#172A45] text-white shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Calculation details */}
            <div className="space-y-2">
              <div className="text-xs uppercase font-extrabold tracking-wider text-[#00C2CB] flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Rincian Perhitungan Biaya Transparan</span>
              </div>
              
              <div className="text-sm text-slate-300 space-y-1.5">
                <p className="flex items-center gap-2 flex-wrap">
                  <span>• Jenis Layanan:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/10 text-white font-bold text-xs sm:text-sm">
                    {wasteType === 'black_water' && <Toilet className="w-4 h-4 text-[#00C2CB]" />}
                    {wasteType === 'grey_water' && <UtensilsCrossed className="w-4 h-4 text-[#FF6B00]" />}
                    {wasteType === 'cleaning_blower' && <Fan className="w-4 h-4 text-cyan-300" />}
                    <span>
                      {wasteType === 'black_water' 
                        ? 'Limbah Black Water (Tinja)' 
                        : wasteType === 'grey_water' 
                          ? 'Limbah Grey Water (Lumpur, Lemak)' 
                          : 'Cleaning / Blower Lumpur'}
                    </span>
                  </span>
                </p>
                <p>
                  • Tarif Dasar: <strong className="text-white">Rp {baseRatePerCubic.toLocaleString('id-ID')}</strong> / kubik (non manifest)
                </p>
                {manifestOption === 'dengan_manifest' && (
                  <p className="text-[#FF6B00]">
                    • Tambahan Dokumen Manifest Resmi: <strong>+Rp 400.000</strong> / kubik
                  </p>
                )}
                <p>
                  • Total Tarif per Kubik: <strong className="text-[#00C2CB]">Rp {totalRatePerCubic.toLocaleString('id-ID')}</strong> / kubik
                </p>
                <p>
                  • Volume yang Dihitung: <strong className="text-white">{volume} Kubik (m³)</strong>
                </p>
              </div>
            </div>

            {/* Total Price Card */}
            <div className="bg-white/10 p-5 rounded-2xl border border-white/15 text-center sm:text-right shrink-0">
              <span className="text-xs font-bold text-slate-300 block mb-1">
                Total Estimasi Biaya
              </span>
              <div className="text-3xl sm:text-4xl font-black text-white text-shadow-sm">
                Rp {totalPrice.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-cyan-200 font-semibold block mt-1">
                {volume} m³ × Rp {totalRatePerCubic.toLocaleString('id-ID')}
              </span>
            </div>

          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Harga transparan di awal tanpa biaya siluman
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00C2CB]" /> Armada tangki resmi PT Kusuma Gemilang Raya
            </span>
          </div>
        </div>

        {/* Submit to WhatsApp */}
        <button
          type="submit"
          className="w-full py-4 px-6 rounded-2xl bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer group"
        >
          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Kirim Rincian & Booking via WhatsApp (Otomatis)</span>
        </button>

        <p className="text-center text-xs text-slate-500">
          WhatsApp Resmi: <strong className="text-[#0A192F]">{CONTACT_INFO.phoneDisplay}</strong> • Online 24 Jam Siap Meluncur ke Lokasi
        </p>
      </form>
    </div>
  );
}
