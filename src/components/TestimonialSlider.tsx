import React, { useState, useEffect, useRef } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote, 
  CheckCircle2, 
  Building2, 
  Home, 
  Utensils, 
  Factory, 
  ShieldCheck,
  ThumbsUp,
  MessageSquareQuote,
  PenLine,
  Send,
  X,
  HeartHandshake
} from 'lucide-react';
import { CONTACT_INFO, KOTA_BEKASI, KAB_BEKASI } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  location: string;
  category: 'Rumah' | 'Restoran' | 'Industri' | 'Kost';
  service: string;
  volumeOrDetails: string;
  story: string;
  rating: number;
  date: string;
  verified: boolean;
  tag: string;
}

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: '1',
    name: 'Bpk. Hendra Gunawan',
    role: 'Ketua Pengurus RT 05',
    location: 'Grand Galaxy City, Bekasi Selatan',
    category: 'Rumah',
    service: 'Sedot Septic Tank Rumah & Kloset Meluap',
    volumeOrDetails: 'Volume: 3 m³ (Non Manifest)',
    story: 'Kloset warga meluap jam 8 malam saat hujan lebat. Kami telepon darurat ke PT Kusuma Gemilang Raya, armada langsung tiba sebelum jam 9 malam. Selang vakum mereka panjang lebih dari 40 meter jadi bisa jangkau rumah di dalam gang tanpa merusak halaman. Pengerjaan cepat, rapi, dan tanpa bau menyengat di lingkungan warga. Tarif 500rb/kubik sangat jelas & jujur!',
    rating: 5,
    date: '3 hari yang lalu',
    verified: true,
    tag: 'Respon Cepat 35 Menit'
  },
  {
    id: '2',
    name: 'Ibu Ratna Dewi',
    role: 'General Manager Restoran',
    location: 'RM Kuliner Seafood, Bekasi Timur',
    category: 'Restoran',
    service: 'Sedot Limbah Grey Water (Grease Trap & Lemak)',
    volumeOrDetails: 'Volume: 4 m³ Limbah Lemak Grey Water',
    story: 'Bak penampungan lemak (grease trap) dapur resto kami mampet menjelang jam makan siang weekend. Tim teknisi tanggap datang dengan tangki vakum bersih dan mesin spiral khusus. Lemak tebal membandel tersedot tuntas sampai bersih dan saluran lancar kembali. Restoran bisa tetap buka melayani tamu tanpa bau tak sedap.',
    rating: 5,
    date: '1 minggu yang lalu',
    verified: true,
    tag: 'Solusi Limbah Grey Water'
  },
  {
    id: '3',
    name: 'Bpk. Ir. Slamet Wibowo',
    role: 'Facility & EHS Manager',
    location: 'Kawasan Industri MM2100, Cikarang Barat',
    category: 'Industri',
    service: 'Pengurasan STP & Limbah Industri dengan Manifest Resmi',
    volumeOrDetails: 'Volume: 10 m³ (Lengkap Dokumen Manifest IPLT)',
    story: 'Pabrik kami mewajibkan vendor sanitasi berlegalitas hukum PT dengan izin NIB KBLI 37011 serta surat manifest pembuangan resmi IPLT untuk audit ISO 14001. PT Kusuma Gemilang Raya sangat profesional, berkas manifest dan faktur pajak diserahkan lengkap. Armada tangki besar dan tim ber-APD lengkap. Rekomendasi utama untuk pabrik di Cikarang.',
    rating: 5,
    date: '2 minggu yang lalu',
    verified: true,
    tag: 'Dokumen Manifest Resmi IPLT'
  },
  {
    id: '4',
    name: 'Ibu Maya Sari',
    role: 'Pengelola Kost 24 Pintu',
    location: 'Tambun Selatan, Kab. Bekasi',
    category: 'Kost',
    service: 'Pelancaran Saluran Pipa Mampet & Sedot WC',
    volumeOrDetails: 'Volume: 4 m³ Septic Tank + 2 Titik Mampet',
    story: 'Anak kost mengeluh kloset mampet dan air kamar mandi menggenang. Teknisi datang bawa mesin drain snake elektrik. Dikerjakan tanpa bongkar lantai keramik sedikitpun! Setelah selesai disiram disinfektan dan wangi kembali. Harga transparan sesuai kubikasi, teknisinya sopan dan ramah.',
    rating: 5,
    date: '3 minggu yang lalu',
    verified: true,
    tag: 'Tanpa Bongkar Keramik'
  },
  {
    id: '5',
    name: 'Bpk. Dimas Pratama',
    role: 'Pengurus Fasilitas Masjid',
    location: 'Rawalumbu, Kota Bekasi',
    category: 'Rumah',
    service: 'Pengurasan Septic Tank & Bak Wudhu Jamaah',
    volumeOrDetails: 'Volume: 5 m³ Black Water',
    story: 'Pelayanan sangat berdedikasi. Kami jadwalkan malam hari agar pagi hari menjelang shalat Jumat toilet dan tempat wudhu jamaah sudah prima. Pengerjaan rapi, tertib, dan bersih kembali. Terima kasih atas pelayanan prima PT Kusuma Gemilang Raya.',
    rating: 5,
    date: '1 bulan yang lalu',
    verified: true,
    tag: 'Layanan Standby 24 Jam'
  }
];

export default function TestimonialSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Rumah' | 'Restoran' | 'Industri' | 'Kost'>('All');
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Modal Tulis Testimoni State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('Bekasi Barat');
  const [authorService, setAuthorService] = useState('Sedot WC / Septic Tank');
  const [authorRating, setAuthorRating] = useState(5);
  const [authorReview, setAuthorReview] = useState('');

  const filteredList = activeFilter === 'All' 
    ? TESTIMONIALS 
    : TESTIMONIALS.filter(t => t.category === activeFilter);

  // Keep index within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeFilter]);

  // Auto-play slider every 6 seconds
  useEffect(() => {
    if (isPaused || filteredList.length <= 1) return;

    autoPlayRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredList.length);
    }, 6000);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isPaused, filteredList.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredList.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    trackConversion('whatsapp_click', 'submit_testimonial_review', {
      name: authorName,
      location: authorLocation,
      service: authorService,
      rating: authorRating
    });

    const stars = '⭐'.repeat(authorRating);
    const text = 
`Halo *Admin PT KUSUMA GEMILANG RAYA*,
Saya ingin mengirimkan ulasan/testimoni layanan untuk website:

👤 *Nama:* ${authorName || 'Pelanggan'}
📍 *Lokasi:* ${authorLocation}, Bekasi
🔧 *Layanan:* ${authorService}
⭐ *Rating:* ${stars} (${authorRating}/5)
💬 *Ulasan / Pengalaman:*
"${authorReview}"

Mohon diverifikasi oleh pengelola website untuk ditambahkan di galeri testimoni. Terima kasih!`;

    window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(text)}`, '_blank');
    setIsReviewModalOpen(false);
    setAuthorReview('');
  };

  const current = filteredList[currentIndex] || TESTIMONIALS[0];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F8F9] relative overflow-hidden" id="testimoni">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-[#00C2CB]/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-[#FF6B00]/10 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E0F7F9] text-[#00C2CB] text-xs font-black uppercase tracking-wider border border-[#00C2CB]/30 mb-3">
            <MessageSquareQuote className="w-4 h-4" />
            <span>Kisah Sukses Klien Kami di Bekasi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-tight">
            Dipercaya Ratusan Pelanggan Rumah Tangga Hingga Kawasan Industri
          </h2>
          
          <p className="mt-3 text-base text-slate-600">
            Bukti nyata kepuasan pelanggan atas respon cepat, kebersihan pengerjaan, dan legalitas resmi PT Kusuma Gemilang Raya.
          </p>

          {/* Social Proof Stats Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-6 pt-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs font-extrabold text-[#0A192F]">4.9 / 5.0 (500+ Pekerjaan)</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-xs font-bold text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>100% Klien Terverifikasi</span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 text-xs font-bold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-[#00C2CB]" />
              <span>NIB KBLI 37011 Berbadan Hukum</span>
            </div>
          </div>

          {/* Tombol Tulis Testimoni Header */}
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#00C2CB] text-[#0A192F] hover:text-white font-extrabold text-xs border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <PenLine className="w-4 h-4 text-[#FF6B00] group-hover:text-white transition-colors" />
              <span>Pernah Pakai Jasa Kami? Tulis Testimoni Anda</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {(['All', 'Rumah', 'Restoran', 'Industri', 'Kost'] as const).map((cat) => {
            const labels: Record<string, string> = {
              All: 'Semua Cerita',
              Rumah: 'Perumahan & Warga',
              Restoran: 'Restoran & Kuliner',
              Industri: 'Kawasan Industri & Pabrik',
              Kost: 'Kost & Ruko'
            };
            return (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#0A192F] text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {labels[cat]}
              </button>
            );
          })}
        </div>

        {/* Testimonial Showcase Card */}
        <div 
          className="max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 relative overflow-hidden transition-all">
            {/* Top quote icon */}
            <div className="absolute top-6 right-8 text-slate-100 pointer-events-none">
              <Quote className="w-24 h-24" />
            </div>

            <div className="relative z-10 space-y-6">
              
              {/* Badge & Meta Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#00C2CB]/15 text-[#0A192F] border border-[#00C2CB]/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00C2CB]" />
                    <span>{current.tag}</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {current.date}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  <div className="flex text-amber-400">
                    {[...Array(current.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-amber-800 ml-1">5.0</span>
                </div>
              </div>

              {/* Service & Details Box */}
              <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold">Jenis Pekerjaan: </span>
                  <strong className="text-[#0A192F]">{current.service}</strong>
                </div>
                <div className="text-[#FF6B00] font-bold">
                  {current.volumeOrDetails}
                </div>
              </div>

              {/* Client Quote Text */}
              <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal italic">
                "{current.story}"
              </p>

              {/* Client Info & Category Icon */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0A192F] to-[#00C2CB] text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                    {current.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-[#0A192F] flex items-center gap-1.5">
                      <span>{current.name}</span>
                      <span title="Klien Terverifikasi" className="inline-flex">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      </span>
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {current.role} • <span className="text-[#00C2CB] font-bold">{current.location}</span>
                    </p>
                  </div>
                </div>

                {/* Category Icon Badge */}
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-3.5 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
                  {current.category === 'Rumah' && <Home className="w-4 h-4 text-[#00C2CB]" />}
                  {current.category === 'Restoran' && <Utensils className="w-4 h-4 text-[#FF6B00]" />}
                  {current.category === 'Industri' && <Factory className="w-4 h-4 text-blue-600" />}
                  {current.category === 'Kost' && <Building2 className="w-4 h-4 text-emerald-600" />}
                  <span>Kategori {current.category}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Slider Controls & Navigation */}
          <div className="flex items-center justify-between mt-6 px-2">
            
            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {filteredList.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-[#00C2CB]' 
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Lihat testimoni ${idx + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full bg-white text-[#0A192F] border border-slate-200 hover:bg-[#00C2CB] hover:text-white hover:border-[#00C2CB] shadow-sm flex items-center justify-center transition-all cursor-pointer"
                aria-label="Testimoni Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-xs font-bold text-slate-500">
                {currentIndex + 1} / {filteredList.length}
              </span>

              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full bg-white text-[#0A192F] border border-slate-200 hover:bg-[#00C2CB] hover:text-white hover:border-[#00C2CB] shadow-sm flex items-center justify-center transition-all cursor-pointer"
                aria-label="Testimoni Selanjutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        </div>

        {/* Bottom CTA Ribbon */}
        <div className="mt-12 max-w-3xl mx-auto bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ThumbsUp className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-[#0A192F]">Ingin Masalah Septic Tank & Saluran Anda Selesai Hari Ini?</h5>
              <p className="text-xs text-slate-500">Tim teknisi kami siap meluncur dalam 30–60 menit ke seluruh area Bekasi.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 justify-center sm:justify-end">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-[#0A192F] font-extrabold text-xs border border-slate-300 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <PenLine className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Tulis Testimoni Anda</span>
            </button>

            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                'Halo PT Kusuma Gemilang Raya, saya melihat ulasan pelanggan di website dan ingin order sedot WC di Bekasi.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all shrink-0"
            >
              Pesan Layanan Sekarang
            </a>
          </div>
        </div>

      </div>

      {/* Review Submission Modal (Kirim Testimoni via WhatsApp Admin) */}
      {isReviewModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsReviewModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col text-[#0A192F]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00C2CB]/20 flex items-center justify-center text-[#00C2CB]">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Tulis Testimoni Anda</h3>
                  <p className="text-xs text-cyan-200">Bagikan Pengalaman Layanan PT Kusuma Gemilang Raya</p>
                </div>
              </div>

              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                aria-label="Tutup form testimoni"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReview} className="p-6 sm:p-7 overflow-y-auto space-y-5">
              
              <div className="p-4 bg-[#E0F7F9]/50 rounded-2xl border border-[#00C2CB]/30 text-xs text-slate-700 leading-relaxed">
                <strong className="block text-[#0A192F] font-bold mb-1">
                  💡 Informasi Kurasi Pengelola Website:
                </strong>
                Ulasan yang Anda tuliskan akan dikirim langsung ke WhatsApp admin resmi kami untuk diverifikasi sebelum ditambahkan secara manual ke galeri testimoni website.
              </div>

              {/* Nama */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1.5">
                  Nama Anda / Inisial / Nama Usaha: *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Contoh: Bpk. Budi Santoso / RM Sederhana"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/20 outline-none text-xs text-slate-800"
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1.5">
                  Lokasi / Kecamatan di Bekasi: *
                </label>
                <select
                  value={authorLocation}
                  onChange={(e) => setAuthorLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/20 outline-none text-xs text-slate-800 bg-white"
                >
                  <optgroup label="Kota Bekasi">
                    {KOTA_BEKASI.map((k) => (
                      <option key={k} value={`${k}, Kota Bekasi`}>{k}, Kota Bekasi</option>
                    ))}
                  </optgroup>
                  <optgroup label="Kabupaten Bekasi & Cikarang">
                    {KAB_BEKASI.map((k) => (
                      <option key={k} value={`${k}, Kab. Bekasi`}>{k}, Kab. Bekasi</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Layanan */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1.5">
                  Jenis Layanan yang Dipesan:
                </label>
                <select
                  value={authorService}
                  onChange={(e) => setAuthorService(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/20 outline-none text-xs text-slate-800 bg-white"
                >
                  <option value="Sedot WC / Septic Tank Rumah">Sedot WC / Septic Tank Rumah</option>
                  <option value="Pelancaran Saluran Air Mampet Tanpa Bongkar">Pelancaran Saluran Mampet Tanpa Bongkar</option>
                  <option value="Sedot Limbah Grey Water (Lemak Restoran)">Sedot Limbah Grey Water (Lemak Restoran)</option>
                  <option value="Sedot Limbah STP & Industri Pabrik (Manifest Resmi)">Sedot Limbah STP Industri (Manifest Resmi)</option>
                  <option value="Pembuatan / Renovasi Septic Tank">Pembuatan / Renovasi Septic Tank</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1.5">
                  Beri Penilaian Bintang:
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setAuthorRating(star)}
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                      aria-label={`Beri rating ${star} bintang`}
                    >
                      <Star 
                        className={`w-7 h-7 ${
                          star <= authorRating 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-300'
                        }`} 
                      />
                    </button>
                  ))}
                  <span className="text-xs font-extrabold text-[#0A192F] ml-2">
                    {authorRating} dari 5 Bintang
                  </span>
                </div>
              </div>

              {/* Cerita Testimoni */}
              <div>
                <label className="block text-xs font-bold text-[#0A192F] mb-1.5">
                  Cerita Pengalaman & Testimoni Anda: *
                </label>
                <textarea
                  required
                  rows={4}
                  value={authorReview}
                  onChange={(e) => setAuthorReview(e.target.value)}
                  placeholder="Ceritakan bagaimana respon teknisi kami, kecepatan kerja, hasil kebersihan, dan transparansi biaya..."
                  className="w-full p-3.5 rounded-xl border border-slate-300 focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/20 outline-none text-xs text-slate-800 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Testimoni via WhatsApp</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </section>
  );
}
