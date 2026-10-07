import React, { useState } from 'react';
import { Calculator, Send, CheckCircle2, FileText, Info, ShieldCheck, MapPin } from 'lucide-react';
import { CONTACT_INFO, KOTA_BEKASI, KAB_BEKASI } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

type WasteType = 'black_water' | 'grey_water';
type ManifestType = 'non_manifest' | 'dengan_manifest';

export default function PriceEstimator() {
  const [wasteType, setWasteType] = useState<WasteType>('black_water');
  const [manifestOption, setManifestOption] = useState<ManifestType>('non_manifest');
  const [volume, setVolume] = useState<number>(2); // in kubik (m3)
  const [district, setDistrict] = useState('Bekasi Barat');
  const [hoseAccess, setHoseAccess] = useState<'standar' | 'panjang'>('standar');
  const [urgency, setUrgency] = useState<'segera' | 'terjadwal'>('segera');
  const [notes, setNotes] = useState('');

  // Base pricing as requested:
  // Limbah Black Water (Tinja): 500rb/kubik non manifest
  // Limbah Grey Water (Lumpur, Lemak): 900rb/kubik non manifest
  // Tambahan Manifest: +400rb/kubik
  const baseRatePerCubic = wasteType === 'black_water' ? 500000 : 900000;
  const manifestFeePerCubic = manifestOption === 'dengan_manifest' ? 400000 : 0;
  const totalRatePerCubic = baseRatePerCubic + manifestFeePerCubic;
  const totalPrice = totalRatePerCubic * volume;

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    const wasteLabel = wasteType === 'black_water' 
      ? 'Limbah Black Water (Tinja / Septic Tank)' 
      : 'Limbah Grey Water (Lumpur, Lemak / STP / Grease Trap)';
    
    const manifestLabel = manifestOption === 'dengan_manifest' 
      ? 'Dengan Dokumen Manifest Resmi (+Rp 400.000/kubik)' 
      : 'Non Manifest (Standar)';

    const hoseLabel = hoseAccess === 'panjang' 
      ? 'Akses Jarak Jauh / Masuk Gang (> 30m)' 
      : 'Akses Standar (< 30m dari mobil)';

    const message = 
`Halo *PT KUSUMA GEMILANG RAYA*,
Saya ingin order & booking layanan sedot limbah di Bekasi:

📋 *Jenis Limbah:* ${wasteLabel}
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
              Tarif resmi transparan per kubik untuk Limbah Black Water & Grey Water (Bekasi)
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSendToWhatsApp} className="p-6 sm:p-8 space-y-6">
        
        {/* Step 1: Pilih Jenis Limbah */}
        <div>
          <label className="block text-sm font-bold text-[#0A192F] mb-3">
            1. Pilih Jenis Limbah:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Black Water Option */}
            <button
              type="button"
              onClick={() => setWasteType('black_water')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                wasteType === 'black_water'
                  ? 'border-[#00C2CB] bg-[#E0F7F9]/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-[#00C2CB]/20 text-[#0A192F] mb-1.5">
                    Septic Tank & Toilet
                  </span>
                  <h4 className="font-extrabold text-base text-[#0A192F]">
                    Limbah Black Water (Tinja)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Sedot WC, pengurasan septic tank rumah tangga, ruko, & kantor
                  </p>
                </div>
                {wasteType === 'black_water' && (
                  <span className="w-5 h-5 rounded-full bg-[#00C2CB] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Tarif Non Manifest:</span>
                <span className="text-base font-black text-[#0A192F]">
                  Rp 500.000<span className="text-xs font-semibold text-slate-500">/kubik</span>
                </span>
              </div>
            </button>

            {/* Grey Water Option */}
            <button
              type="button"
              onClick={() => setWasteType('grey_water')}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative ${
                wasteType === 'grey_water'
                  ? 'border-[#FF6B00] bg-[#FF6B00]/5 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase bg-[#FF6B00]/20 text-[#FF6B00] mb-1.5">
                    STP & Grease Trap
                  </span>
                  <h4 className="font-extrabold text-base text-[#0A192F]">
                    Limbah Grey Water (Lumpur, Lemak)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Sedot limbah dapur resto, bak lemak, lumpur limbah, saluran STP
                  </p>
                </div>
                {wasteType === 'grey_water' && (
                  <span className="w-5 h-5 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    ✓
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Tarif Non Manifest:</span>
                <span className="text-base font-black text-[#FF6B00]">
                  Rp 900.000<span className="text-xs font-semibold text-slate-500">/kubik</span>
                </span>
              </div>
            </button>

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
              
              <div className="text-sm text-slate-300 space-y-1">
                <p>
                  • Jenis: <strong className="text-white">{wasteType === 'black_water' ? 'Limbah Black Water (Tinja)' : 'Limbah Grey Water (Lumpur, Lemak)'}</strong>
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
