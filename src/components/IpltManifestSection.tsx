import React, { useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Building2, 
  Truck, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  QrCode, 
  Eye, 
  Clock, 
  Scale, 
  FileText,
  MapPin,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CONTACT_INFO } from '../data/websiteData';

export default function IpltManifestSection() {
  const [activeTab, setActiveTab] = useState<'klien' | 'iplt' | 'transporter'>('klien');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const manifestData = {
    docNumber: 'MNF-IPLT/BKS/2026/04882',
    date: '12 Februari 2026',
    time: '11:42 WIB',
    clientName: 'PT Cikarang Precision Parts / Klien Terdaftar',
    clientAddress: 'Kawasan Industri GIIC / Delta Silicon, Cikarang, Bekasi',
    wasteType: 'Lumpur Tinja / Black Water Domestik (KBLI 37011)',
    volume: '4.500 Liter (4,5 m³)',
    transporterName: 'PT KUSUMA GEMILANG RAYA',
    license: 'NIB KBLI 37011 / Izin Operasional Angkutan Limbah',
    vehiclePlate: 'B 9428 FYU (Truk Vakum Kapasitas 4.500L)',
    driver: 'Supriyanto (ID: KGR-DVR-08)',
    destination: 'IPLT Sumur Batu - UPTD PALD Dinas Lingkungan Hidup Bekasi',
    grossWeight: '8.450 kg',
    tareWeight: '3.950 kg',
    netWeight: '4.500 kg',
    officer: 'Bambang Sudrajat, S.T. (NIP: 19820412 200801 1 009)'
  };

  return (
    <section id="manifest-iplt" className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-[#00C2CB]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-80 h-80 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00C2CB]/20 text-[#00C2CB] text-xs font-bold border border-[#00C2CB]/30 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#00C2CB]" />
            <span>Transparansi Legalitas & Kepatuhan AMDAL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Contoh Dokumen Manifest Resmi IPLT
          </h2>
          <p className="mt-4 text-base text-slate-300 leading-relaxed">
            PT Kusuma Gemilang Raya memastikan setiap limbah yang disedot dibuang dan diolah secara legal ke 
            <strong className="text-white"> Instalasi Pengolahan Lumpur Tinja (IPLT Sumur Batu / UPTD PALD Bekasi)</strong>.
            Bukan dibuang sembarangan ke sungai atau tanah terbuka. Bukti manifest sah kami serahkan sebagai lampiran audit.
          </p>
        </div>

        {/* 2-Column Grid: Manifest Visualization vs Features & ISO 14001 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          
          {/* Left Column: Visual Manifest Document Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-slate-800 relative">
            {/* Top Sheet Tab Selector */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Salinan Rangkap:</span>
                <div className="inline-flex rounded-lg bg-slate-100 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setActiveTab('klien')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'klien'
                        ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Lembar 1 (Klien)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('iplt')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'iplt'
                        ? 'bg-amber-100 text-amber-900 shadow-sm border border-amber-300'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Lembar 2 (IPLT)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('transporter')}
                    className={`px-3 py-1 rounded-md transition-all ${
                      activeTab === 'transporter'
                        ? 'bg-rose-100 text-rose-900 shadow-sm border border-rose-300'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Lembar 3 (Arsip)
                  </button>
                </div>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>RESMI & VALID DLH</span>
              </div>
            </div>

            {/* Document Header (Kop Surat) */}
            <div className="border-b-2 border-slate-800 pb-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-[#00C2CB] flex items-center justify-center font-black text-xl shrink-0 shadow-inner">
                  KGR
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight uppercase tracking-tight">
                    PT KUSUMA GEMILANG RAYA
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Jasa Transporter Sanitasi Berizin NIB KBLI 37011 • Rekanan Resmi IPLT Bekasi
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Kota Bekasi & Seluruh Kawasan Industri Kabupaten Bekasi
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right shrink-0">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  NO. MANIFEST
                </span>
                <span className="font-mono text-xs sm:text-sm font-black text-[#FF6B00] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {manifestData.docNumber}
                </span>
              </div>
            </div>

            {/* Document Title Banner */}
            <div className="bg-slate-100 border border-slate-300 rounded-xl p-2.5 text-center mb-5">
              <h5 className="font-black text-xs sm:text-sm tracking-wider text-slate-900 uppercase">
                SURAT JALAN & BERITA ACARA MANIFEST PEMBUANGAN LUMPUR TINJA (IPLT)
              </h5>
              <p className="text-[11px] text-slate-600 font-medium">
                Penerimaan & Pengolahan Resmi Instalasi Pengolahan Lumpur Tinja DLH Bekasi
              </p>
            </div>

            {/* Form Sections Grid */}
            <div className="space-y-4 text-xs">
              
              {/* Bagian 1: Data Klien (Penghasil) */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#00C2CB]" />
                    I. IDENTITAS PENGHASIL LIMBAH (KLIEN)
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Tgl: {manifestData.date}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Nama Perusahaan / Pemilik:</span>
                    <strong className="text-slate-800">{manifestData.clientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Lokasi Pengambilan:</span>
                    <span className="text-slate-700">{manifestData.clientAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Karakteristik Limbah:</span>
                    <strong className="text-slate-800">{manifestData.wasteType}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Volume Pengambilan:</span>
                    <strong className="text-emerald-700 font-mono text-xs">{manifestData.volume}</strong>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Data Transporter Berizin */}
              <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#FF6B00]" />
                    II. TRANSPORTER PENGANGKUT RESMI
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    KBLI 37011 Terdaftar
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Badan Usaha:</span>
                    <strong className="text-slate-800">{manifestData.transporterName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Legalitas Izin:</span>
                    <span className="text-slate-700">{manifestData.license}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">No. Polisi Armada & Kapasitas:</span>
                    <strong className="text-slate-800 font-mono">{manifestData.vehiclePlate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pengemudi / Petugas:</span>
                    <span className="text-slate-700">{manifestData.driver}</span>
                  </div>
                </div>
              </div>

              {/* Bagian 3: Titik Pembuangan & Timbangan Resmi IPLT */}
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
                <div className="flex items-center justify-between mb-2 pb-1 border-b border-amber-200">
                  <span className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-600" />
                    III. VERIFIKASI TIMBANGAN & PENERIMAAN IPLT
                  </span>
                  <span className="text-[10px] text-amber-800 font-mono font-bold">
                    Pukul: {manifestData.time}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="sm:col-span-3">
                    <span className="text-amber-700 block">Fasilitas Penerima Resmi:</span>
                    <strong className="text-slate-900">{manifestData.destination}</strong>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-slate-500 text-[10px] block">Berat Bruto:</span>
                    <span className="font-mono font-bold text-slate-800">{manifestData.grossWeight}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-slate-500 text-[10px] block">Berat Tara Truk:</span>
                    <span className="font-mono font-bold text-slate-800">{manifestData.tareWeight}</span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-amber-200">
                    <span className="text-slate-500 text-[10px] block">Netto Limbah Tinja:</span>
                    <span className="font-mono font-bold text-emerald-700">{manifestData.netWeight}</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Validation Stamps & Signatures */}
            <div className="mt-5 pt-4 border-t-2 border-dashed border-slate-300 grid grid-cols-3 gap-2 text-center text-[10px]">
              {/* Client Signature */}
              <div className="space-y-1">
                <span className="text-slate-500 block">Diserahkan Klien:</span>
                <div className="h-10 flex items-center justify-center italic text-slate-400">
                  (Tanda Tangan Klien)
                </div>
                <span className="font-bold text-slate-700 block border-t border-slate-300 pt-1">
                  Bag. HSE / Facility
                </span>
              </div>

              {/* Driver Signature */}
              <div className="space-y-1">
                <span className="text-slate-500 block">Pengemudi Transporter:</span>
                <div className="h-10 flex items-center justify-center font-bold text-slate-700 italic">
                  Supriyanto
                </div>
                <span className="font-bold text-slate-700 block border-t border-slate-300 pt-1">
                  PT Kusuma Gemilang
                </span>
              </div>

              {/* IPLT Official Seal Stamp */}
              <div className="space-y-1 relative">
                <span className="text-slate-500 block">Petugas Timbangan IPLT:</span>
                
                {/* Simulated Official Seal Stamp */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 -rotate-6">
                  <div className="border-2 border-red-600 rounded-full px-2 py-1 text-[9px] font-black text-red-600 uppercase tracking-tighter bg-red-50/60 shadow-xs">
                    ★ UPTD PALD KAB. BEKASI ★<br/>
                    <span className="text-[8px] text-red-700">DITERIMA & DIOLAH</span>
                  </div>
                </div>

                <div className="h-10 flex items-end justify-center font-bold text-slate-800">
                  Bambang S., S.T.
                </div>
                <span className="font-bold text-slate-700 block border-t border-slate-300 pt-1">
                  NIP. 19820412...
                </span>
              </div>
            </div>

            {/* Barcode & Security Verification Footer */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[10px]">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-slate-800" />
                <span className="font-mono">VERIFIED CODE: KGR-IPLT-2026-BKS-AUTH</span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1 font-bold text-[#FF6B00] hover:underline cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Lihat Format Resolusi Penuh</span>
              </button>
            </div>
          </div>

          {/* Right Column: Why Manifest Matters & Compliance Benefits (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Value Proposition Box */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <FileCheck2 className="w-6 h-6 text-[#00C2CB]" />
                Mengapa Dokumen Manifest Sangat Penting?
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Banyak jasa sedot liar membuang limbah langsung ke selokan, sawah, atau sungai secara ilegal untuk menekan biaya retribusi. 
                Hal ini melanggar UU Lingkungan Hidup dan membahayakan reputasi perusahaan Anda.
              </p>

              <div className="space-y-3.5">
                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Syarat Wajib Audit ISO 14001 & PROPER</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Auditor lingkungan mensyaratkan dokumen manifest pembuangan limbah berizin dan faktur pajak sah sebagai bukti kepatuhan pengelolaan limbah domestik.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-[#00C2CB]/20 text-[#00C2CB] flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Bebas Risiko Sanksi Dinas Lingkungan Hidup (DLH)</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Membebaskan pihak perusahaan atau pengelola properti dari tuduhan pencemaran lingkungan karena seluruh limbah terlacak menuju IPLT resmi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Data Timbangan Transparan & Akurat</h5>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Volume limbah dicatat berdasarkan meter kubik (m³) atau tonase timbangan jembatan resmi UPTD IPLT, mencegah kecurangan volume ritase.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Box for Corporate HSE & Procurement */}
            <div className="bg-gradient-to-br from-[#0A192F] to-[#172A45] border border-[#00C2CB]/40 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs font-bold text-[#00C2CB] uppercase tracking-wide">
                  Layanan B2B & Korporasi
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2">
                Butuh Manifest untuk Kebutuhan Kantor atau Pabrik Anda?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Tim admin PT Kusuma Gemilang Raya menerbitkan manifest resmi, berita acara pengerjaan, serta faktur pajak e-Faktur resmi untuk setiap transaksi.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                    'Halo PT Kusuma Gemilang Raya, saya dari perusahaan ingin konsultasi pengadaan jasa sedot limbah dengan Dokumen Manifest Resmi IPLT di Bekasi.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold text-xs shadow-md transition-all text-center"
                >
                  <FileText className="w-4 h-4" />
                  <span>Minta Surat Manifest & Penawaran</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all text-center cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#00C2CB]" />
                  <span>Pratinjau Format</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 4-Step Chain of Custody (Alur Pengelolaan Limbah Legal) */}
        <div className="border-t border-slate-800 pt-12">
          <div className="text-center mb-8">
            <h4 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Alur Rantai Kepatuhan (Chain of Custody) Limbah ke IPLT
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Dari lokasi penyedotan hingga pengolahan akhir ramah lingkungan di Bekasi
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Step 1 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-[#00C2CB] transition-all">
              <div className="w-9 h-9 rounded-xl bg-[#00C2CB]/20 text-[#00C2CB] font-black text-sm flex items-center justify-center mb-3">
                01
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Penyedotan di Lokasi</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pengukuran volume septic tank bersama perwakilan klien dan penandatanganan lembar pertama surat jalan di lokasi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-[#00C2CB] transition-all">
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 font-black text-sm flex items-center justify-center mb-3">
                02
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Transportasi Truk Vakum</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Limbah diangkut dengan armada tangki tertutup berstandar K3, kedap bau, dan terpantau GPS langsung menuju IPLT.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-[#00C2CB] transition-all">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 font-black text-sm flex items-center justify-center mb-3">
                03
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Timbangan & Uji IPLT</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pencatatan tonase di jembatan timbang resmi UPTD IPLT Sumur Batu Bekasi dan pembubuhan stempel sah penerimaan limbah.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-5 hover:border-[#00C2CB] transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 font-black text-sm flex items-center justify-center mb-3">
                04
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Penyerahan Dokumen Valid</h5>
              <p className="text-xs text-slate-400 leading-relaxed">
                Klien menerima lembar asli dokumen manifest berstempel resmi beserta Berita Acara & Faktur Pajak untuk audit lingkungan.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Modal Fullscreen Preview */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white text-slate-900 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0A192F] text-[#00C2CB] flex items-center justify-center font-black">
                KGR
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-900">
                  Pratinjau Format Dokumen Manifest Resmi IPLT
                </h4>
                <p className="text-xs text-slate-500">
                  PT Kusuma Gemilang Raya • Kerjasama Resmi IPLT Sumur Batu Bekasi
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs text-slate-700 mb-6">
              <p>
                <strong>Nomor Dokumen:</strong> <span className="font-mono text-[#FF6B00]">{manifestData.docNumber}</span>
              </p>
              <p>
                <strong>Standar Pengolahan:</strong> Instalasi Pengolahan Lumpur Tinja (IPLT) dengan sistem stabilisasi anaerobik-aerobik sesuai baku mutu Permen LHK.
              </p>
              <p>
                <strong>Fungsi untuk Klien:</strong> Bukti validasi hukum bahwa limbah sanitasi / STP domestik Anda telah diserahkan dan diolah di fasilitas pengolahan limbah pemerintah.
              </p>
              <p>
                <strong>Penerbitan Dokumen:</strong> Diterbitkan fisik rangkap 3 berstempel basah dan tersedia salinan PDF ber-barcode untuk pelaporan online SIMPEL LHK.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                  'Halo PT Kusuma Gemilang Raya, saya butuh contoh berkas Manifest IPLT lengkap dengan Faktur Pajak untuk pengajuan vendor di perusahaan kami di Bekasi.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold text-center text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Minta Sampel Format via WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-center text-xs cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
