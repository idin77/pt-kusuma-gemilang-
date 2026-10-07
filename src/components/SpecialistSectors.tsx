import React, { useState } from 'react';
import { 
  Factory, 
  Utensils, 
  Home, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Sparkles, 
  Clock, 
  PhoneCall, 
  Layers,
  Award
} from 'lucide-react';
import { CONTACT_INFO } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

export interface SectorDetail {
  id: string;
  key: 'manufaktur' | 'hospitality' | 'residensial';
  title: string;
  tagline: string;
  icon: any;
  badge: string;
  imgSrc: string;
  description: string;
  features: string[];
  specs: {
    label: string;
    value: string;
  }[];
  locations: string;
  waPrompt: string;
}

export const SECTORS: SectorDetail[] = [
  {
    id: 'sec-manufaktur',
    key: 'manufaktur',
    title: 'Industri Manufaktur & Pabrik',
    tagline: 'Solusi Limbah STP & Cair Skala Besar Berizin Lingkungan',
    icon: Factory,
    badge: 'Legalitas IPLT & K3',
    imgSrc: '/src/assets/images/spesialis_manufaktur_1791392092175.jpg',
    description: 'Layanan penyedotan limbah cair non-B3 dan pengurasan instalasi Sewage Treatment Plant (STP) pabrik dengan standar kepatuhan audit lingkungan hidup (ISO 14001).',
    features: [
      'Surat jalan resmi dan dokumen Manifest Pembuangan IPLT berizin pemerintah',
      'Penyedotan lumpur biologis (sludge) dan air limbah industri berkala',
      'Armada truk tangki berkapasitas besar untuk ritase multi-tangki (10 - 50 m³)',
      'Teknisi bersertifikat K3 dengan seragam APD, helm safety, dan sepatu boots',
      'Tersedia kontrak kerja sama berkala (MoU), faktur pajak SPPKP, & invoice resmi'
    ],
    specs: [
      { label: 'Kapasitas Proyek', value: 's/d 50.000 Liter / Hari' },
      { label: 'Standar K3', value: 'K3 Certified & APD Lengkap' },
      { label: 'Izin Dokumen', value: 'Manifest IPLT & NIB 37011' },
      { label: 'Jadwal Kerja', value: '24 Jam Sesuai Shift Pabrik' }
    ],
    locations: 'Kawasan Industri MM2100, Jababeka I-VII, Delta Silicon, EJIP, GIIC Deltamas, BIIE Hyundai Cikarang',
    waPrompt: 'Halo PT Kusuma Gemilang Raya, kami dari divisi EHS/Facility pabrik di kawasan industri Cikarang/Bekasi. Ingin konsultasi layanan limbah STP industri dan dokumen manifest resmi.'
  },
  {
    id: 'sec-hospitality',
    key: 'hospitality',
    title: 'Hotel, Restoran & Komersial F&B',
    tagline: 'Kuras Grease Trap & Septic Tank Higienis Tanpa Bau',
    icon: Utensils,
    badge: 'Hospitality Standard',
    imgSrc: '/src/assets/images/spesialis_hotel_resto_1791392108921.jpg',
    description: 'Penanganan rutin bak lemak dapur (grease trap) restoran, hotel, food court, dan katering agar tidak meluap, mampet, atau menimbulkan aroma tidak sedap di area makan tamu.',
    features: [
      'Pengurasan lemak tebal & minyak pekat kitchen sink dengan pompa vakum kuat',
      'Pengerjaan fleksibel di luar jam operasional resto (malam hari atau subuh)',
      'Peralatan modern higienis yang tidak mencemari lantai dapur komersial',
      'Penanganan septic tank toilet tamu secara senyap dan bebas kebocoran aroma',
      'Paket perawatan bulanan terjangkau dengan bukti dokumentasi pengerjaan rapi'
    ],
    specs: [
      { label: 'Tipe Limbah', value: 'Grey Water (Lemak & Minyak)' },
      { label: 'Waktu Operasi', value: 'Malam / Dini Hari (Non-Jam Resto)' },
      { label: 'Higienitas', value: 'Dibersihkan & Dibilas Tuntas' },
      { label: 'Administrasi', value: 'Kuitansi & Surat Kerja Resmi' }
    ],
    locations: 'Restoran Waralaba, Hotel Berbintang, Mal, Food Court, Sentra Kuliner Galaxy & Harapan Indah',
    waPrompt: 'Halo PT Kusuma Gemilang Raya, kami dari manajemen restoran/hotel di Bekasi. Ingin konsultasi pengurasan grease trap lemak dapur dan perawatan saluran berkala.'
  },
  {
    id: 'sec-residensial',
    key: 'residensial',
    title: 'Perumahan Elit & Cluster Modern',
    tagline: 'Pelayanan Eksklusif, Bersih, Senyap & Menjaga Estetika Lingkungan',
    icon: Home,
    badge: 'Premium Residential',
    imgSrc: '/src/assets/images/spesialis_perumahan_elit_1791392127133.jpg',
    description: 'Layanan penyedotan septic tank dan pelancaran kloset untuk hunian modern, townhouse, dan perumahan elit dengan perhatian ekstra terhadap kebersihan garasi, taman, dan jalan cluster.',
    features: [
      'Armada truk tangki terawat bersih, rapi, tanpa ceceran air limbah di jalan paving cluster',
      'Selang spiral panjang 50 - 70 meter menjangkau carport dalam tanpa merusak taman atau marmer',
      'Mesin pompa berperedam suara untuk meminimalkan kebisingan di lingkungan tenang cluster',
      'Pelancaran pipa toilet mampet tanpa membongkar keramik lantai mewah',
      'Finishing penyemprotan desinfektan dan karbol wangi aromaterapi setelah penyedotan selesai'
    ],
    specs: [
      { label: 'Jangkauan Selang', value: '50 - 70 Meter (Masuk Carport)' },
      { label: 'Metode Pipa', value: 'Spiral Drain Cleaner Tanpa Bongkar' },
      { label: 'Finishing', value: 'Disinfektan & Karbol Aromaterapi' },
      { label: 'Respon Armada', value: '25 – 40 Menit Tiba di Gerbang Cluster' }
    ],
    locations: 'Summarecon Bekasi, Grand Galaxy City, Grand Wisata Tambun, Kemang Pratama, Harapan Indah 1 & 2',
    waPrompt: 'Halo PT Kusuma Gemilang Raya, saya warga cluster perumahan di Bekasi. Ingin order sedot WC dengan armada bersih dan selang panjang tanpa merusak lantai.'
  }
];

export default function SpecialistSectors() {
  const [activeTab, setActiveTab] = useState<'manufaktur' | 'hospitality' | 'residensial'>('manufaktur');

  const selectedSector = SECTORS.find(s => s.key === activeTab) || SECTORS[0];

  const handleConsultation = (sector: SectorDetail) => {
    trackConversion('whatsapp_click', 'specialist_sector_inquiry', {
      sectorKey: sector.key,
      sectorTitle: sector.title
    });

    const url = `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(sector.waPrompt)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="sektor-spesialis">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0F7F9] text-[#00C2CB] text-xs font-black uppercase tracking-wider border border-[#00C2CB]/30 mb-3">
            <Layers className="w-4 h-4" />
            <span>Sektor Layanan Spesialis</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-tight">
            Layanan Khusus Manufaktur, Hospitality & Residensial Elit
          </h2>
          
          <p className="mt-3 text-base text-slate-600">
            Kami memahami setiap sektor memiliki standar SOP yang berbeda. PT Kusuma Gemilang Raya menghadirkan armada khusus, teknisi tersertifikasi, dan legalitas lengkap.
          </p>
        </div>

        {/* Sector Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {SECTORS.map((sector) => {
            const Icon = sector.icon;
            const isActive = activeTab === sector.key;
            return (
              <button
                key={sector.key}
                onClick={() => setActiveTab(sector.key)}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-xs sm:text-sm transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-[#0A192F] text-white border-[#0A192F] shadow-lg -translate-y-0.5'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-[#0A192F]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#00C2CB]' : 'text-slate-400'}`} />
                <span>{sector.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Sector Showcase Card */}
        <div className="bg-gradient-to-br from-[#F8FAFC] to-[#F1F8F9] rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#00C2CB]/15 text-[#0A192F] border border-[#00C2CB]/30">
                    {selectedSector.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                    Standar Operasional Profesional
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#0A192F] leading-tight">
                  {selectedSector.title}
                </h3>
                
                <p className="text-sm sm:text-base font-bold text-[#FF6B00]">
                  {selectedSector.tagline}
                </p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                {selectedSector.description}
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#0A192F] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#00C2CB]" />
                  Keunggulan Penanganan di Sektor Ini:
                </h4>
                <ul className="space-y-2.5">
                  {selectedSector.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-200">
                {selectedSector.specs.map((spec, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-center sm:text-left">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">{spec.label}</span>
                    <strong className="text-xs font-black text-[#0A192F]">{spec.value}</strong>
                  </div>
                ))}
              </div>

              {/* Area Coverage Box */}
              <div className="text-xs text-slate-600 bg-white/80 p-3.5 rounded-xl border border-slate-200 flex items-start gap-2">
                <Award className="w-4 h-4 text-[#00C2CB] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#0A192F] block">Kawasan & Lokasi Prioritas:</strong>
                  <span>{selectedSector.locations}</span>
                </div>
              </div>

              {/* CTA Action Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleConsultation(selectedSector)}
                  className="px-7 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Konsultasi Sektor {selectedSector.title.split(' ')[0]} via WA</span>
                </button>

                <span className="text-xs font-semibold text-slate-500">
                  ⚡ Penjadwalan Cepat & Bebas Biaya Survei
                </span>
              </div>

            </div>

            {/* Right Photo Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white aspect-[4/3] lg:aspect-[3/4] bg-slate-900 group">
                <img
                  src={selectedSector.imgSrc}
                  alt={selectedSector.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-5 left-5 right-5 text-white space-y-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#00C2CB] text-[#0A192F] text-[10px] font-black uppercase">
                    SOP Spesialis Bersertifikat
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {selectedSector.title}
                  </h4>
                  <p className="text-xs text-slate-200">
                    Didukung peralatan tangki vakum khusus dan tenaga ahli ber-APD.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
