import { useState, useMemo } from 'react';
import { Search, MapPin, CheckCircle, Navigation } from 'lucide-react';
import { KOTA_BEKASI, KAB_BEKASI, CONTACT_INFO } from '../data/websiteData';
import { trackConversion } from '../utils/conversionTracker';

export default function AreaChecker() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'kota' | 'kabupaten'>('all');

  const filteredKota = useMemo(() => {
    return KOTA_BEKASI.filter(area => 
      area.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [searchQuery]);

  const filteredKab = useMemo(() => {
    return KAB_BEKASI.filter(area => 
      area.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [searchQuery]);

  const isMatched = filteredKota.length > 0 || filteredKab.length > 0;

  const handleOrderArea = (areaName: string) => {
    trackConversion('whatsapp_click', 'area_checker_order', { areaName });

    const text = encodeURIComponent(
      `Halo PT Kusuma Gemilang Raya, saya butuh jasa sedot WC di wilayah *${areaName}, Bekasi*. Apakah armada bisa meluncur hari ini?`
    );
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Search Bar & Tabs */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ketik nama kecamatan Anda di Bekasi (misal: Tambun, Jatiasih, Cikarang...)"
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-slate-300 focus:border-[#00C2CB] focus:ring-4 focus:ring-[#00C2CB]/15 outline-none text-sm font-medium bg-white shadow-sm transition-all text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-full cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Filter buttons */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#0A192F] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Semua Wilayah ({KOTA_BEKASI.length + KAB_BEKASI.length})
          </button>
          <button
            onClick={() => setActiveTab('kota')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kota'
                ? 'bg-[#00C2CB] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Kota Bekasi ({KOTA_BEKASI.length})
          </button>
          <button
            onClick={() => setActiveTab('kabupaten')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'kabupaten'
                ? 'bg-[#FF6B00] text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Kabupaten Bekasi & Cikarang ({KAB_BEKASI.length})
          </button>
        </div>

        {searchQuery && (
          <div className="text-center">
            {isMatched ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="w-3.5 h-3.5" />
                Wilayah tercover 24 jam! Klik nama kecamatan untuk langsung hubungi armada.
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                Kecamatan tidak ditemukan di daftar, namun kami tetap melayani seluruh penjuru Bekasi. Hubungi kami langsung!
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid of Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Kota Bekasi */}
        {(activeTab === 'all' || activeTab === 'kota') && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-[#0A192F] flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#00C2CB]/15 flex items-center justify-center text-[#00C2CB]">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Kota Bekasi</span>
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#00C2CB]/10 text-[#00C2CB]">
                {filteredKota.length} Kecamatan
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {filteredKota.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleOrderArea(tag)}
                  title={`Pesan sedot WC di ${tag}`}
                  className="group px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F8FAFC] text-[#0A192F] border border-slate-200 hover:bg-[#E0F7F9] hover:border-[#00C2CB] hover:text-[#0A192F] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-[#00C2CB] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{tag}</span>
                </button>
              ))}
              {filteredKota.length === 0 && (
                <p className="text-sm text-slate-400 italic">Tidak ada kecamatan yang cocok di Kota Bekasi.</p>
              )}
            </div>
            
            <p className="text-[11px] text-slate-400 mt-5 pt-3 border-t border-slate-100">
              💡 Tip: Klik nama kecamatan untuk pesan armada sedot WC terdekat dengan respon tercepat.
            </p>
          </div>
        )}

        {/* Kabupaten Bekasi */}
        {(activeTab === 'all' || activeTab === 'kabupaten') && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-md border border-slate-200 transition-all hover:shadow-lg">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-[#0A192F] flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF6B00]/15 flex items-center justify-center text-[#FF6B00]">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Kabupaten Bekasi & Cikarang</span>
              </h3>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FF6B00]/10 text-[#FF6B00]">
                {filteredKab.length} Kecamatan
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {filteredKab.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleOrderArea(tag)}
                  title={`Pesan sedot WC di ${tag}`}
                  className="group px-3.5 py-2 rounded-full text-xs font-semibold bg-[#F8FAFC] text-[#0A192F] border border-slate-200 hover:bg-[#FF6B00]/10 hover:border-[#FF6B00] hover:text-[#0A192F] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3 h-3 text-[#FF6B00] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>{tag}</span>
                </button>
              ))}
              {filteredKab.length === 0 && (
                <p className="text-sm text-slate-400 italic">Tidak ada kecamatan yang cocok di Kabupaten Bekasi.</p>
              )}
            </div>

            <p className="text-[11px] text-slate-400 mt-5 pt-3 border-t border-slate-100">
              💡 Menjangkau seluruh kawasan industri Cikarang (MM2100, Jababeka, Delta Silicon, GIIC, EJIP) dan perumahan rakyat.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
