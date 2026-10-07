import React, { useState } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  Eye, 
  Calendar, 
  ShieldCheck, 
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { CONTACT_INFO } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'rumah' | 'resto' | 'industri' | 'alat';
  categoryLabel: string;
  location: string;
  date: string;
  desc: string;
  imgSrc: string;
  tag: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'Armada & Tim Teknisi Siap Meluncur ke Lokasi Pelanggan',
    category: 'rumah',
    categoryLabel: 'Armada Lapangan',
    location: 'Pos Operasional Bekasi Timur',
    date: 'Dokumentasi Harian',
    desc: 'Armada truk tangki berkapasitas besar dan tim teknisi berpengalaman siap siaga 24 jam dengan selang spiral panjang untuk menjangkau lokasi perumahan hingga gang sempit.',
    imgSrc: '/sedot_wc_bekasi.jpg',
    tag: 'Armada Siap Tempur'
  },
  {
    id: '2',
    title: 'Pengurasan Septic Tank & Kloset di Kompleks Perumahan',
    category: 'rumah',
    categoryLabel: 'Sedot WC Rumah',
    location: 'Perumahan Grand Galaxy, Bekasi Selatan',
    date: 'Pekerjaan Minggu Ini',
    desc: 'Penyedotan septic tank yang penuh dan meluap pada rumah tinggal warga. Menggunakan pompa vakum bertenaga tinggi sehingga pengerjaan cepat tuntas tanpa bau menyengat.',
    imgSrc: '/src/assets/images/dokumentasi_sedot_perumahan_1791390386930.jpg',
    tag: 'Tuntas Tanpa Bau'
  },
  {
    id: '3',
    title: 'Pembersihan Grease Trap & Lemak Dapur Restoran',
    category: 'resto',
    categoryLabel: 'Limbah Grey Water',
    location: 'Kawasan Kuliner Juanda, Bekasi',
    date: 'Perawatan Berkala Resto',
    desc: 'Penyedotan rutin limbah lemak dan sisa minyak pada bak grease trap dapur komersial. Saluran pembuangan kembali lancar dan higienis tanpa mengganggu jam operasional.',
    imgSrc: '/src/assets/images/dokumentasi_grease_trap_resto_1791390406813.jpg',
    tag: 'Limbah Grey Water'
  },
  {
    id: '4',
    title: 'Sedot Limbah STP & Lumpur Pabrik dengan Manifest Resmi',
    category: 'industri',
    categoryLabel: 'Industri & Pabrik',
    location: 'Kawasan Industri MM2100, Cikarang Barat',
    date: 'Proyek Industri Resmi',
    desc: 'Pengurasan lumpur aktif instalasi STP pabrik manufaktur skala besar. Dilengkapi surat manifest IPLT resmi, SOP keselamatan K3, dan tim berseragam APD lengkap.',
    imgSrc: '/src/assets/images/dokumentasi_industri_cikarang_1791390420199.jpg',
    tag: 'Manifest Resmi IPLT'
  },
  {
    id: '5',
    title: 'Penanganan Darurat Saluran Mampet di Permukiman Warga',
    category: 'rumah',
    categoryLabel: 'Sedot WC & Mampet',
    location: 'Harapan Indah, Kota Bekasi',
    date: 'Panggilan Cepat 24 Jam',
    desc: 'Teknisi tiba dalam waktu 35 menit setelah pemesanan. Selang panjang digelar rapi dan pekerjaan langsung ditangani dengan teliti hingga kloset dan saluran lancar kembali.',
    imgSrc: '/src/assets/images/hero_truck_bekasi_1791387786316.jpg',
    tag: 'Respon Cepat 30 Menit'
  },
  {
    id: '6',
    title: 'Peralatan Mesin Spiral Drain Cleaner & High Pressure Jetting',
    category: 'alat',
    categoryLabel: 'Teknologi Modern',
    location: 'Workshop Peralatan PT Kusuma Gemilang Raya',
    date: 'Standar Peralatan SNI',
    desc: 'Mesin rigid spiral modern untuk melancarkan pipa mampet akibat kerak lemak keras atau sumbatan tanpa merusak lantai keramik maupun instalasi pipa rumah tangga.',
    imgSrc: '/src/assets/images/vacuum_equipment_detail_1791387814670.jpg',
    tag: 'Teknologi Tanpa Bongkar'
  }
];

export default function WorkGallery() {
  const [activeTab, setActiveTab] = useState<'semua' | 'rumah' | 'resto' | 'industri' | 'alat'>('semua');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  const filteredItems = activeTab === 'semua'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeTab);

  const handleOrderSpecific = (item: GalleryItem) => {
    trackConversion('whatsapp_click', 'gallery_modal_cta', {
      galleryId: item.id,
      title: item.title,
      location: item.location
    });

    const text = encodeURIComponent(
      `Halo PT Kusuma Gemilang Raya, saya melihat dokumentasi lapangan: *${item.title}* di ${item.location}. Saya ingin konsultasi layanan serupa untuk lokasi saya di Bekasi.`
    );
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${text}`, '_blank');
  };

  return (
    <section className="py-20 bg-white relative overflow-hidden" id="galeri">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0F7F9] text-[#00C2CB] text-xs font-black uppercase tracking-wider border border-[#00C2CB]/30 mb-3">
            <Camera className="w-4 h-4" />
            <span>Dokumentasi Pekerjaan Lapangan Nyata</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-tight">
            Galeri Dokumentasi Nyata di Lapangan
          </h2>
          
          <p className="mt-3 text-base text-slate-600">
            Bukti visual transparansi dan profesionalisme armada PT Kusuma Gemilang Raya saat menangani berbagai permasalahan sanitasi di Kota & Kabupaten Bekasi.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-5 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              100% Dokumentasi Asli PT Kusuma Gemilang Raya
            </span>
            <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-[#00C2CB]" />
              Armada Beroperasi Setiap Hari 24 Jam
            </span>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { key: 'semua', label: 'Semua Foto (6)' },
            { key: 'rumah', label: 'Sedot WC Rumah Tangga' },
            { key: 'resto', label: 'Limbah Restoran & Grey Water' },
            { key: 'industri', label: 'Pabrik & Industri Cikarang' },
            { key: 'alat', label: 'Peralatan Canggih' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-[#0A192F] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedPhoto(item)}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badge */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  
                  {/* Top Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide bg-[#0A192F]/80 backdrop-blur-md text-[#00C2CB] border border-white/20">
                      {item.categoryLabel}
                    </span>
                  </div>

                  {/* Top Right Tag */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-[#FF6B00] text-white shadow-sm">
                      {item.tag}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-200">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  </div>

                  {/* Hover Overlay Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 backdrop-blur-[2px]">
                    <span className="px-4 py-2 rounded-full bg-white text-[#0A192F] font-extrabold text-xs shadow-lg flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-[#00C2CB]" /> Lihat Detail Foto
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-[#00C2CB]" />
                    <span>{item.date}</span>
                  </div>
                  <h3 className="font-extrabold text-base text-[#0A192F] group-hover:text-[#00C2CB] transition-colors leading-snug mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Quick Action */}
              <div className="px-6 pb-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-[#FF6B00] group-hover:underline flex items-center gap-1">
                  Perbesar Foto <ChevronRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[11px] font-bold text-slate-400">
                  PT Kusuma Gemilang Raya
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#0A192F] to-[#172A45] rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00C2CB]">
              <Sparkles className="w-4 h-4" />
              <span>Butuh Penanganan Cepat Hari Ini?</span>
            </div>
            <h4 className="text-xl font-extrabold text-white">
              Armada Truk Tangki Kami Siap Datang Langsung ke Lokasi Anda
            </h4>
            <p className="text-xs text-slate-300">
              Layanan sedot WC, septic tank, grey water lemak resto, dan STP industri di seluruh Kota & Kabupaten Bekasi.
            </p>
          </div>

          <a
            href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
              'Halo PT Kusuma Gemilang Raya, saya melihat galeri dokumentasi pekerjaan di website dan ingin order sedot WC di Bekasi.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all shrink-0 flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Pesan Armada via WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Lightbox / Photo Detail Modal */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedPhoto(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image */}
            <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
              <img
                src={selectedPhoto.imgSrc}
                alt={selectedPhoto.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
                aria-label="Tutup foto"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#00C2CB] text-[#0A192F]">
                  {selectedPhoto.tag}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-4 overflow-y-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <MapPin className="w-4 h-4 text-[#FF6B00]" />
                  <span>{selectedPhoto.location}</span>
                </div>
                <span className="text-xs text-slate-400 font-semibold">
                  {selectedPhoto.date}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#0A192F]">
                {selectedPhoto.title}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedPhoto.desc}
              </p>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  <strong className="block text-[#0A192F]">Jaminan Mutu PT Kusuma Gemilang Raya:</strong>
                  Pengerjaan tuntas, berlegalitas NIB KBLI 37011, selang panjang tanpa merusak halaman.
                </div>

                <button
                  onClick={() => handleOrderSpecific(selectedPhoto)}
                  className="px-6 py-2.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 shrink-0"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Pesan Layanan Seperti Ini</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
