import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Factory, 
  Truck, 
  ShieldCheck, 
  FileCheck2, 
  MapPin, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Wrench, 
  Sparkles,
  ExternalLink,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { CORPORATE_CLIENTS, CorporateClient, CONTACT_INFO } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

type ClientCategoryFilter = 'all' | 'manufacturing' | 'logistics' | 'engineering' | 'heavy_equipment' | 'food_chemical';

export default function CorporateClientsSection() {
  const [activeFilter, setActiveFilter] = useState<ClientCategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<CorporateClient | null>(null);

  const filteredClients = useMemo(() => {
    return CORPORATE_CLIENTS.filter((client) => {
      // Category filter
      let matchesCategory = true;
      if (activeFilter === 'manufacturing') {
        matchesCategory = client.category === 'manufacturing';
      } else if (activeFilter === 'logistics') {
        matchesCategory = client.category === 'logistics';
      } else if (activeFilter === 'engineering') {
        matchesCategory = client.category === 'engineering';
      } else if (activeFilter === 'heavy_equipment') {
        matchesCategory = client.category === 'heavy_equipment';
      } else if (activeFilter === 'food_chemical') {
        matchesCategory = client.category === 'food' || client.category === 'chemical';
      }

      // Search filter
      const matchesSearch = 
        !searchQuery.trim() ||
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.serviceScope.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const categoryCounts = useMemo(() => {
    return {
      all: CORPORATE_CLIENTS.length,
      manufacturing: CORPORATE_CLIENTS.filter(c => c.category === 'manufacturing').length,
      logistics: CORPORATE_CLIENTS.filter(c => c.category === 'logistics').length,
      engineering: CORPORATE_CLIENTS.filter(c => c.category === 'engineering').length,
      heavy_equipment: CORPORATE_CLIENTS.filter(c => c.category === 'heavy_equipment').length,
      food_chemical: CORPORATE_CLIENTS.filter(c => c.category === 'food' || c.category === 'chemical').length,
    };
  }, []);

  const handleInquireCorporate = (companyName?: string) => {
    const text = companyName 
      ? `Halo PT Kusuma Gemilang Raya, saya dari divisi pengadaan / GA ingin konsultasi pengadaan jasa sanitasi & sedot limbah resmi IPLT seperti yang telah dipercayakan oleh rekanan Anda (${companyName}). Mohon info penawaran harga & prosedur vendor.`
      : `Halo PT Kusuma Gemilang Raya, saya tertarik dengan layanan sedot limbah STP & septic tank industri untuk perusahaan kami dengan Dokumen Manifest Resmi IPLT & Faktur Pajak. Mohon info pengajuan vendor B2B.`;
    
    trackConversion('whatsapp_click', 'corporate_clients_inquiry', {
      companyName: companyName || 'General_B2B'
    });

    window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getClientIcon = (category: CorporateClient['category']) => {
    switch (category) {
      case 'logistics':
        return <Truck className="w-5 h-5 text-sky-500" />;
      case 'manufacturing':
        return <Factory className="w-5 h-5 text-amber-500" />;
      case 'engineering':
        return <Wrench className="w-5 h-5 text-teal-500" />;
      case 'heavy_equipment':
        return <Building2 className="w-5 h-5 text-orange-500" />;
      case 'food':
      case 'chemical':
        return <Sparkles className="w-5 h-5 text-emerald-500" />;
      default:
        return <Building2 className="w-5 h-5 text-[#00C2CB]" />;
    }
  };

  return (
    <section 
      id="klien" 
      aria-label="Klien & Perusahaan Rekanan"
      className="py-20 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F1F8F9] border-t border-slate-200/80 relative overflow-hidden"
    >
      {/* Decorative background glows */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#00C2CB]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00C2CB]/10 border border-[#00C2CB]/30 text-[#008c94] text-xs font-black tracking-wide uppercase mb-3">
            <ShieldCheck className="w-4 h-4 text-[#00C2CB]" />
            <span>Klien & Perusahaan Rekanan Resmi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight leading-tight">
            Dipercaya 15+ Perusahaan Nasional & Multinasional
          </h2>

          <p className="mt-3.5 text-base text-slate-600 leading-relaxed">
            Berikut adalah daftar perusahaan dan industri ternama yang telah bekerja sama dengan <strong>PT Kusuma Gemilang Raya</strong> untuk penyedotan limbah STP, pembersihan septic tank pabrik, dan pengelolaan air limbah legal berdokumen <strong>Manifest Resmi IPLT</strong>.
          </p>

          {/* Quick Corporate Trust Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-700">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Manifest IPLT Sumur Batu Sah
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <FileCheck2 className="w-4 h-4 text-[#00C2CB]" />
              Faktur Pajak PPN & SPPKP
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <Building2 className="w-4 h-4 text-[#FF6B00]" />
              Kontrak Rutin (PKS) & Berita Acara
            </span>
          </div>
        </div>

        {/* Dynamic Continuous Ticker Bar */}
        <div className="mb-12 overflow-hidden bg-[#0A192F] text-white py-3.5 rounded-2xl shadow-md border border-slate-800">
          <div className="flex items-center">
            <div className="shrink-0 px-4 py-1 bg-[#00C2CB] text-slate-950 font-black text-xs uppercase tracking-wider rounded-lg ml-3 mr-2 hidden sm:flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5" />
              <span>Rekanan Kami:</span>
            </div>

            {/* Scrolling track */}
            <div className="flex overflow-hidden relative w-full group">
              <div className="flex shrink-0 animate-marquee whitespace-nowrap gap-6 items-center">
                {CORPORATE_CLIENTS.concat(CORPORATE_CLIENTS).map((item, idx) => (
                  <span 
                    key={`${item.id}-${idx}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-200 hover:text-[#00C2CB] transition-colors cursor-pointer"
                    onClick={() => setSelectedClient(item)}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00C2CB]" />
                    <span className="font-extrabold text-white">{item.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({item.sector.split('&')[0].trim()})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'all'
                    ? 'bg-[#0A192F] text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Semua ({categoryCounts.all})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('manufacturing')}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'manufacturing'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Manufaktur & Otomotif ({categoryCounts.manufacturing})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('logistics')}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'logistics'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Logistik & Pelabuhan ({categoryCounts.logistics})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('food_chemical')}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'food_chemical'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Pangan & Kimia ({categoryCounts.food_chemical})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('heavy_equipment')}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'heavy_equipment'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Alat Berat & Mesin ({categoryCounts.heavy_equipment})
              </button>

              <button
                type="button"
                onClick={() => setActiveFilter('engineering')}
                className={`px-3 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === 'engineering'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Teknik & Rekayasa ({categoryCounts.engineering})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama perusahaan..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C2CB] focus:bg-white transition-all text-[#0A192F]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Menampilkan <strong>{filteredClients.length}</strong> dari <strong>{CORPORATE_CLIENTS.length}</strong> perusahaan rekanan
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Layanan berizin legalitas NIB KBLI 37011
            </span>
          </div>
        </div>

        {/* Corporate Clients Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-[#00C2CB] p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent line on hover */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00C2CB] to-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-[#00C2CB]/10 border border-slate-200 group-hover:border-[#00C2CB]/40 flex items-center justify-center shrink-0 transition-colors">
                    {getClientIcon(client.category)}
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/80">
                    {client.badgeText}
                  </span>
                </div>

                {/* Company Name */}
                <h3 className="text-base sm:text-lg font-extrabold text-[#0A192F] group-hover:text-[#008c94] transition-colors leading-snug">
                  {client.name}
                </h3>

                {/* Sector Tag */}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.sector}</span>
                </div>

                {/* Service Scope */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1">
                    <FileCheck2 className="w-3 h-3 text-emerald-600" />
                    <span>Ruang Lingkup Pengerjaan:</span>
                  </div>
                  <p className="text-slate-600 font-medium pl-4 leading-relaxed">
                    {client.serviceScope}
                  </p>
                </div>

                {/* Location indicator */}
                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.location}</span>
                </div>
              </div>

              {/* Card Footer CTA */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  ✓ Berkas Manifest IPLT Sah
                </span>

                <button
                  type="button"
                  onClick={() => handleInquireCorporate(client.name)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:text-[#E65F00] group/btn cursor-pointer"
                  title={`Ajukan kerjasama vendor seperti ${client.name}`}
                >
                  <span>Info Vendor B2B</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center max-w-md mx-auto my-6">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="font-bold text-slate-800 text-sm">Perusahaan Tidak Ditemukan</h4>
            <p className="text-xs text-slate-500 mt-1">
              Tidak ada perusahaan yang cocok dengan pencarian "{searchQuery}". Silakan coba kata kunci lain atau reset filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-1.5 rounded-lg bg-[#0A192F] text-white text-xs font-bold"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* B2B Procurement Call to Action Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#0A192F] via-[#102A4C] to-[#0A192F] rounded-3xl p-6 sm:p-8 text-white border border-white/10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00C2CB]/20 text-[#00C2CB] text-xs font-bold uppercase tracking-wider border border-[#00C2CB]/30">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Pengadaan Vendor & PKS Perusahaan
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Butuh Surat Penawaran Resmi & Kelengkapan Vendor B2B?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Kami siap melayani kebutuhan pengadaan tender, penyusunan Perjanjian Kerja Sama (PKS) berkala, Faktur Pajak PPN lengkap (SPPKP), serta manifest pembuangan resmi IPLT Sumur Batu Bekasi untuk audit ISO 14001 dan lingkungan hidup.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={() => handleInquireCorporate()}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-black text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Hubungi Tim Pengadaan B2B</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Modal Quick View Client Details */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-fade-in space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  {getClientIcon(selectedClient.category)}
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#0A192F]">{selectedClient.name}</h4>
                  <span className="text-xs text-slate-500">{selectedClient.sector}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="font-semibold text-slate-500">Kategori:</span>
                <span className="font-bold">{selectedClient.sector}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="font-semibold text-slate-500">Area Operasional:</span>
                <span className="font-bold">{selectedClient.location}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200/80">
                <span className="font-semibold text-slate-500">Status Vendor:</span>
                <span className="font-bold text-emerald-600">✓ Mitra Terverifikasi</span>
              </div>
              <div className="pt-1">
                <span className="font-semibold text-slate-500 block mb-1">Cakupan Layanan:</span>
                <p className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {selectedClient.serviceScope}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  const client = selectedClient;
                  setSelectedClient(null);
                  handleInquireCorporate(client.name);
                }}
                className="px-5 py-2 rounded-xl bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Konsultasi Vendor B2B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
