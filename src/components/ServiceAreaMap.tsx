import React, { useState } from 'react';
import { 
  Map, 
  MapPin, 
  Navigation, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  PhoneCall, 
  Zap,
  Layers
} from 'lucide-react';
import { CONTACT_INFO } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

interface HubStation {
  id: string;
  name: string;
  code: string;
  zones: string[];
  eta: string;
  trucks: string;
  address: string;
  color: string;
}

export const OPERATIONAL_HUBS: HubStation[] = [
  {
    id: 'hub-1',
    name: 'Posko 1: Kota Bekasi Pusat & Selatan',
    code: 'HUB-BKS-01',
    zones: ['Bekasi Barat', 'Bekasi Selatan', 'Rawalumbu', 'Jatiasih', 'Pondok Gede', 'Jatisampurna'],
    eta: '25 – 35 Menit',
    trucks: '3 Unit Truk Tangki Vakum',
    address: 'Akses Tol Becakayu & Tol Barat',
    color: '#00C2CB'
  },
  {
    id: 'hub-2',
    name: 'Posko 2: Cikarang Kawasan Industri & Pusat',
    code: 'HUB-CKR-02',
    zones: ['Cikarang Barat (MM2100)', 'Cikarang Selatan (EJIP)', 'Cikarang Utara (Jababeka)', 'Cikarang Pusat (Delta Silicon)'],
    eta: '20 – 35 Menit',
    trucks: '4 Unit Tangki Industri & Biofilter',
    address: 'Dekat Gerbang Tol Cikarang Barat & Cibatu',
    color: '#FF6B00'
  },
  {
    id: 'hub-3',
    name: 'Posko 3: Bekasi Timur, Tambun & Cibitung',
    code: 'HUB-TMB-03',
    zones: ['Tambun Selatan', 'Tambun Utara', 'Bekasi Timur', 'Cibitung', 'Mustika Jaya', 'Setu'],
    eta: '30 – 40 Menit',
    trucks: '3 Unit Truk Vakum Selang Panjang',
    address: 'Akses Jalan Nasional Sultan Hasanudin & Grand Wisata',
    color: '#10B981'
  },
  {
    id: 'hub-4',
    name: 'Posko 4: Bekasi Utara, Babelan & Tarumajaya',
    code: 'HUB-BBL-04',
    zones: ['Bekasi Utara', 'Medan Satria', 'Harapan Indah', 'Babelan', 'Tarumajaya', 'Sukawangi'],
    eta: '30 – 45 Menit',
    trucks: '2 Unit Tangki Vakum',
    address: 'Akses Tol Cibitung-Cilincing & Harapan Indah',
    color: '#6366F1'
  }
];

export default function ServiceAreaMap() {
  const [selectedHub, setSelectedHub] = useState<HubStation>(OPERATIONAL_HUBS[0]);

  const handleOrderHub = (hub: HubStation) => {
    trackConversion('whatsapp_click', 'service_map_hub_order', {
      hubId: hub.id,
      hubName: hub.name
    });

    const text = encodeURIComponent(
      `Halo PT Kusuma Gemilang Raya, saya butuh armada sedot WC terdekat dari *${hub.name}*. Lokasi saya di Bekasi. Mohon info estimasi kedatangan ke alamat saya.`
    );
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${text}`, '_blank');
  };

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden" id="peta-jangkauan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0F7F9] text-[#00C2CB] text-xs font-black uppercase tracking-wider border border-[#00C2CB]/30 mb-3">
            <Map className="w-4 h-4" />
            <span>Peta Operasional & Jaringan Posko Siaga</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-tight">
            Peta Jangkauan Layanan Kota & Kabupaten Bekasi
          </h2>
          
          <p className="mt-3 text-base text-slate-600">
            Didukung 4 posko armada tangki yang tersebar strategis di titik-titik utama Bekasi untuk memastikan waktu tiba tercepat tanpa hambatan macet.
          </p>
        </div>

        {/* Main Map Visual & Hub Selector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Map Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200 overflow-hidden space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-xs font-extrabold text-[#0A192F] uppercase tracking-wide">
                  Sistem Disposisi Armada GPS Aktif 24 Jam
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                12+ Truk Beroperasi
              </span>
            </div>

            {/* Static Map Graphic Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-inner border border-slate-200 aspect-[16/10] bg-slate-100 group">
              <img
                src="/src/assets/images/peta_layanan_bekasi_1791391568077.jpg"
                alt="Peta Jangkauan Layanan Sedot WC PT Kusuma Gemilang Raya di Kota dan Kabupaten Bekasi"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-black/20 pointer-events-none"></div>

              {/* Map Floating Overlay Badges */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-md border border-white text-xs font-black text-[#0A192F] flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#00C2CB]" />
                <span>Radius Cakupan 100% Seluruh Bekasi</span>
              </div>

              {/* Bottom Map Info Ribbon */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="bg-[#0A192F]/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[10px]">Posko Terpilih:</span>
                    <strong className="text-white font-extrabold">{selectedHub.name}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#00C2CB] bg-[#00C2CB]/20 px-2.5 py-1 rounded-lg border border-[#00C2CB]/30">
                      ⚡ Tiba {selectedHub.eta}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Legend & Assurance Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bebas Biaya Transport Tambahan</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#00C2CB] shrink-0" />
                <span>Selang 50m Masuk Gang Padat</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-[#FF6B00] shrink-0" />
                <span>Akses Jalur Cepat Tol</span>
              </div>
            </div>

          </div>

          {/* Right Column: 4 Hub Cards & Selector (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#0A192F] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00C2CB]" />
                Pilih Posko Armada Terdekat:
              </h3>
              <span className="text-[11px] font-bold text-slate-400">4 Titik Siaga</span>
            </div>

            {OPERATIONAL_HUBS.map((hub) => {
              const isSelected = selectedHub.id === hub.id;
              return (
                <div
                  key={hub.id}
                  onClick={() => setSelectedHub(hub)}
                  className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white ${
                    isSelected
                      ? 'border-[#00C2CB] ring-2 ring-[#00C2CB]/15 shadow-md -translate-y-0.5'
                      : 'border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-sm"
                        style={{ backgroundColor: hub.color }}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-sm text-[#0A192F]">{hub.name}</h4>
                        <span className="text-[11px] font-bold text-slate-400">{hub.code} • {hub.address}</span>
                      </div>
                    </div>

                    <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {hub.eta}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 mb-3 pl-10">
                    <span className="font-semibold text-slate-500 block text-[11px]">Cakupan Wilayah:</span>
                    <p className="line-clamp-2 leading-relaxed text-slate-700">
                      {hub.zones.join(', ')}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between pl-10">
                    <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-[#00C2CB]" />
                      {hub.trucks}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOrderHub(hub);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0A192F] hover:bg-[#FF6B00] text-white text-[11px] font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <PhoneCall className="w-3 h-3" />
                      Panggil Posko Ini
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Quick Dispatch Banner */}
            <div className="bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00C2CB]/20 text-[#00C2CB] flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <strong className="block text-white">Butuh Armada Tiba Lebih Cepat?</strong>
                  <span className="text-[11px] text-cyan-200">Hubungi langsung via WhatsApp dengan lokasi maps Anda</span>
                </div>
              </div>

              <a
                href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                  'Halo PT Kusuma Gemilang Raya, saya butuh penanganan sedot WC darurat di lokasi saya. Mohon kirim armada terdekat.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-[11px] shrink-0"
              >
                Kirim Lokasi Maps
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
