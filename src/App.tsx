import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Menu, 
  X, 
  Check, 
  ArrowRight, 
  Wrench, 
  Droplet, 
  Building2, 
  ShieldCheck, 
  Home, 
  Factory, 
  Store, 
  Clock, 
  Calendar, 
  ChevronDown, 
  Award, 
  FileCheck2, 
  Sparkles,
  PhoneCall,
  ArrowUp,
  BadgeDollarSign,
  MapPin,
  Truck,
  CheckCircle2,
  Receipt,
  FileCheck,
  ShieldAlert,
  Flame,
  HelpCircle
} from 'lucide-react';
import { 
  CONTACT_INFO, 
  SERVICES, 
  WHY_US, 
  SOLUTIONS, 
  PROCESS_STEPS, 
  FAQS, 
  ServiceItem 
} from './data/websiteData';
import ServiceModal from './components/ServiceModal';
import PriceEstimator from './components/PriceEstimator';
import AreaChecker from './components/AreaChecker';
import ServiceAreaMap from './components/ServiceAreaMap';
import TestimonialSlider from './components/TestimonialSlider';
import WorkGallery from './components/WorkGallery';
import SpecialistSectors from './components/SpecialistSectors';
import SanitationPartnersBanner from './components/SanitationPartnersBanner';
import MarketingAnalyticsModal from './components/MarketingAnalyticsModal';
import AutoRedirectModal from './components/AutoRedirectModal';
import AutoRedirectFloatingWidget from './components/AutoRedirectFloatingWidget';
import { initConversionTracking } from './utils/conversionTracker';
import { 
  detectDevice, 
  DeviceInfo, 
  generatePersonalizedWaMessage, 
  getOptimizedWhatsAppUrl, 
  SECTION_CONTEXTS,
  executeAutoRedirect 
} from './utils/whatsappRedirect';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(detectDevice());
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [showAutoRedirectModal, setShowAutoRedirectModal] = useState<boolean>(false);
  const [autoCountdown, setAutoCountdown] = useState<boolean>(false);

  useEffect(() => {
    // Inisialisasi pelacakan konversi global
    initConversionTracking();

    // Deteksi perangkat pengunjung
    setDeviceInfo(detectDevice());

    // Cek parameter auto-redirect di URL (?redirect=wa atau ?hubungi=wa atau hash #autoredirect)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('redirect') === 'wa' || urlParams.get('hubungi') === 'wa' || window.location.hash === '#autoredirect') {
        setShowAutoRedirectModal(true);
        setAutoCountdown(true);
      }
    }

    // Observer untuk mendeteksi section yang sedang aktif di viewport
    const sectionIds = [
      'beranda',
      'layanan',
      'sektor-spesialis',
      'tentang',
      'area',
      'harga',
      'dokumentasi',
      'galeri',
      'testimoni',
      'faq',
      'kontak'
    ];

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          if (id && sectionIds.includes(id)) {
            setActiveSection(id);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '-15% 0px -40% 0px',
      threshold: 0.15
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    // Shortcut Ctrl+Shift+M untuk melihat statistik evaluasi pemasaran
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setShowMarketingModal(prev => !prev);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const currentPersonalizedWaMessage = generatePersonalizedWaMessage(activeSection, deviceInfo.deviceType);
  const currentWaUrl = getOptimizedWhatsAppUrl(currentPersonalizedWaMessage, deviceInfo.isMobile);
  const mobileWaUrl = getOptimizedWhatsAppUrl(generatePersonalizedWaMessage(activeSection, 'mobile'), true);
  const desktopWaUrl = getOptimizedWhatsAppUrl(generatePersonalizedWaMessage(activeSection, 'desktop'), false);

  const defaultWaMessage = encodeURIComponent(
    'Halo PT Kusuma Gemilang Raya, saya ingin konsultasi layanan sedot WC di Bekasi.'
  );

  return (
    <div className="min-h-screen bg-white text-[#0A192F] selection:bg-[#00C2CB] selection:text-white pb-24 md:pb-0">
      {/* Top Banner for Emergency Service */}
      <div className="bg-[#0A192F] text-white py-2 px-4 text-xs font-semibold border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Armada Siaga 24 Jam Non-Stop di Seluruh Wilayah Kota & Kabupaten Bekasi</span>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${CONTACT_INFO.phoneRaw}`} 
              data-cta-source="top_banner_call"
              className="hover:text-[#00C2CB] transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span>Telepon Langsung: {CONTACT_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#beranda" className="flex items-center gap-3 group">
              <img
                src={CONTACT_INFO.logoUrl}
                alt="Logo PT Kusuma Gemilang Raya"
                className="w-12 h-12 rounded-full object-cover shadow-sm ring-2 ring-[#00C2CB]/30 group-hover:scale-105 transition-transform"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="leading-tight">
                <h3 className="font-black text-base sm:text-lg tracking-tight text-[#0A192F] uppercase">
                  PT KUSUMA GEMILANG RAYA
                </h3>
                <span className="text-xs font-bold text-[#00C2CB] tracking-wide block">
                  Jasa Sedot WC Bekasi Resmi
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <ul className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-semibold text-[#0A192F]">
              <li><a href="#beranda" className="hover:text-[#00C2CB] transition-colors">Beranda</a></li>
              <li><a href="#tentang" className="hover:text-[#00C2CB] transition-colors">Tentang Kami</a></li>
              <li><a href="#layanan" className="hover:text-[#00C2CB] transition-colors">Layanan Kami</a></li>
              <li><a href="#sektor-spesialis" className="hover:text-[#00C2CB] transition-colors">Sektor Spesialis</a></li>
              <li><a href="#area" className="hover:text-[#00C2CB] transition-colors">Area Layanan</a></li>
              <li><a href="#harga" className="hover:text-[#00C2CB] transition-colors">Harga</a></li>
              <li><a href="#dokumentasi" className="hover:text-[#00C2CB] transition-colors">Legalitas</a></li>
              <li><a href="#galeri" className="hover:text-[#00C2CB] transition-colors">Galeri</a></li>
              <li><a href="#testimoni" className="hover:text-[#00C2CB] transition-colors">Testimoni</a></li>
              <li><a href="#faq" className="hover:text-[#00C2CB] transition-colors">FAQ</a></li>
              <li><a href="#kontak" className="hover:text-[#00C2CB] transition-colors">Hubungi Kami</a></li>
            </ul>

            {/* Header Right Action */}
            <div className="hidden sm:flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setAutoCountdown(false);
                  setShowAutoRedirectModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#E0F7F9] hover:bg-[#cbf1f3] text-[#008c94] font-black text-xs border border-[#00C2CB]/40 shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
                title="Buka asisten pesan otomatis & deteksi perangkat"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span className="hidden xl:inline">Auto-Redirect</span>
                <span>Pesan WA</span>
              </button>

              <a
                href={currentWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-source="header_wa_button"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                {/* Custom WhatsApp SVG Icon */}
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>{CONTACT_INFO.phone}</span>
              </a>
            </div>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#0A192F] hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4 shadow-xl animate-fade-in">
            <ul className="space-y-3 font-semibold text-base text-[#0A192F]">
              <li><a href="#beranda" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Beranda</a></li>
              <li><a href="#tentang" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Tentang Kami</a></li>
              <li><a href="#layanan" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Layanan Kami</a></li>
              <li><a href="#sektor-spesialis" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Sektor Spesialis</a></li>
              <li><a href="#area" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Area Layanan</a></li>
              <li><a href="#harga" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Harga</a></li>
              <li><a href="#dokumentasi" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Dokumentasi & Legalitas</a></li>
              <li><a href="#galeri" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Galeri Foto Lapangan</a></li>
              <li><a href="#testimoni" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Testimoni Klien</a></li>
              <li><a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">FAQ</a></li>
              <li><a href="#kontak" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Hubungi Kami</a></li>
            </ul>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setAutoCountdown(false);
                  setShowAutoRedirectModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#E0F7F9] text-[#008c94] font-black text-center text-xs border border-[#00C2CB]/40 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span>Auto-Redirect WA ({SECTION_CONTEXTS[activeSection]?.badge || 'Pesan Personal'})</span>
              </button>

              <a
                href={mobileWaUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cta-source="mobile_drawer_wa"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#FF6B00] text-white font-bold text-center text-sm shadow-md"
              >
                <span>WhatsApp: {CONTACT_INFO.phone}</span>
              </a>
              <a
                href={`tel:${CONTACT_INFO.phoneRaw}`}
                data-cta-source="mobile_drawer_call"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-slate-100 text-[#0A192F] font-bold text-center text-sm"
              >
                <Phone className="w-4 h-4 text-[#00C2CB]" />
                <span>Telepon Langsung ({CONTACT_INFO.phoneDisplay})</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="beranda" className="relative py-12 lg:py-20 bg-gradient-to-br from-[#F8FAFC] via-[#F1F8F9] to-[#E0F7F9] overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#00C2CB]/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E0F7F9] text-[#00C2CB] font-bold text-xs sm:text-sm border border-[#00C2CB]/30">
                <Check className="w-4 h-4 text-[#00C2CB] stroke-[3]" />
                <span>Jasa Sedot WC Bekasi & Sekitarnya</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#0A192F] tracking-tight leading-[1.1]">
                  JASA SEDOT WC BEKASI
                </h1>
                <span className="text-xl sm:text-2xl font-black text-[#00C2CB] block mt-2">
                  PT KUSUMA GEMILANG RAYA
                </span>
              </div>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Layanan sedot WC, septic tank, saluran mampet, limbah STP, dan kebutuhan sanitasi untuk rumah, kantor, usaha, dan industri di Bekasi.
              </p>

              {/* Trust Points */}
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2.5 font-bold text-sm text-[#0A192F]">
                  <span className="text-[#00C2CB] font-black text-lg">✓</span> Cepat & Profesional
                </div>
                <div className="flex items-center gap-2.5 font-bold text-sm text-[#0A192F]">
                  <span className="text-[#00C2CB] font-black text-lg">✓</span> Harga Transparan
                </div>
                <div className="flex items-center gap-2.5 font-bold text-sm text-[#0A192F]">
                  <span className="text-[#00C2CB] font-black text-lg">✓</span> Berpengalaman & Resmi
                </div>
                <div className="flex items-center gap-2.5 font-bold text-sm text-[#0A192F]">
                  <span className="text-[#00C2CB] font-black text-lg">✓</span> Melayani Bekasi & Sekitarnya
                </div>
              </div>

              {/* Hero CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href={currentWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-source="hero_cta"
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-black text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
                >
                  HUBUNGI SEKARANG
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setAutoCountdown(false);
                    setShowAutoRedirectModal(true);
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-full bg-white hover:bg-slate-50 text-[#0A192F] font-bold text-sm border-2 border-[#0A192F] transition-all text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-[#00C2CB]" />
                  <span>Auto-Redirect WA ({deviceInfo.isMobile ? 'Mobile' : 'Desktop'})</span>
                </button>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-500 pt-1">
                <Clock className="w-4 h-4 text-[#00C2CB]" />
                <span>Layanan 24 Jam | Hari Libur Tetap Melayani | Siap Datang Langsung</span>
              </div>
            </div>

            {/* Hero Right Image & Visual Badges */}
            <div className="relative mx-auto lg:max-w-none max-w-lg">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/3] bg-slate-100">
                <img
                  src={CONTACT_INFO.heroImg}
                  alt="Truk Sedot WC Profesional Bekasi - PT Kusuma Gemilang Raya"
                  className="w-full h-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#00C2CB] text-xs font-black uppercase tracking-wider mb-1">
                    Armada Resmi Siap Tempur
                  </span>
                  <p className="text-sm font-semibold text-slate-100">
                    Truk Vakum Kapasitas Besar & Selang Panjang Masuk Gang Sempit
                  </p>
                </div>
              </div>

              {/* Floating Quick Response Badge */}
              <div className="absolute -bottom-6 -left-4 sm:left-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500">Estimasi Tiba</div>
                  <div className="text-sm font-extrabold text-[#0A192F]">30 - 60 Menit di Lokasi</div>
                </div>
              </div>

              <div className="absolute -top-4 -right-4 bg-[#0A192F] text-white py-2 px-4 rounded-xl shadow-lg border border-slate-700 text-xs font-bold hidden sm:block">
                ⭐ Rating 4.9/5 • 500+ Pekerjaan Selesai
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Highlights Ribbon */}
      <section className="bg-white border-y border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#FF6B00]">24 Jam</div>
              <div className="text-xs font-bold text-slate-600">Siap Panggilan Darurat</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#0A192F]">10+ Armada</div>
              <div className="text-xs font-bold text-slate-600">Truk Vakum Siap Jalan</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#00C2CB]">NIB 37011</div>
              <div className="text-xs font-bold text-slate-600">Badan Usaha Resmi PT</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
              <div className="text-xs font-bold text-slate-600">Garansi Sampai Lancar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              Keahlian Spesialis Sanitasi
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Layanan Utama Kami
            </h2>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Solusi lengkap dan terpercaya untuk masalah sanitasi dan limbah di Bekasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="group bg-white rounded-3xl p-7 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-[#E0F7F9] text-[#00C2CB] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {srv.id === 'sedot-wc' && <Droplet className="w-8 h-8" />}
                    {srv.id === 'saluran-mampet' && <Wrench className="w-8 h-8" />}
                    {srv.id === 'limbah-stp' && <Building2 className="w-8 h-8" />}
                    {srv.id === 'pembuatan-septic-tank' && <ShieldCheck className="w-8 h-8" />}
                  </div>

                  <span className="text-[11px] font-bold text-[#FF6B00] uppercase tracking-wider block mb-1">
                    {srv.badge}
                  </span>

                  <h3 className="text-xl font-bold text-[#0A192F] mb-3 group-hover:text-[#00C2CB] transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedService(srv)}
                    className="inline-flex items-center gap-1.5 font-bold text-sm text-[#FF6B00] hover:text-[#E65F00] transition-colors cursor-pointer group/btn"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                      `Halo PT Kusuma Gemilang Raya, saya ingin pesan layanan ${srv.title} di Bekasi.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-slate-400 hover:text-[#00C2CB] transition-colors"
                  >
                    Pesan WA →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sektor Layanan Spesialis (Industri Manufaktur, Hotel/Resto & Perumahan Elit) */}
      <SpecialistSectors />

      {/* Why Choose Us Section */}
      <section id="tentang" className="py-20 bg-[#0A192F] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              Keunggulan Kompetitif
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Kenapa Memilih PT Kusuma Gemilang Raya?
            </h2>
            <p className="mt-3 text-base text-slate-300">
              Kami berkomitmen memberikan layanan sanitasi terbaik dengan standar profesional.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {WHY_US.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00C2CB] rounded-2xl p-6 transition-all flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#00C2CB] text-[#0A192F] font-black flex items-center justify-center shrink-0 text-lg">
                  ✓
                </div>
                <div>
                  <h4 className="font-bold text-base text-white mb-1.5">{item.title}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Team and Fleet Photo Feature */}
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative">
            <img
              src={CONTACT_INFO.teamImg}
              alt="Armada & Teknisi Profesional Sedot WC Bekasi - PT Kusuma Gemilang Raya"
              className="w-full h-80 sm:h-96 md:h-[480px] object-cover object-center"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent flex items-end p-6 sm:p-10">
              <div className="max-w-2xl">
                <span className="inline-block px-3 py-1 rounded-full bg-[#00C2CB] text-[#0A192F] font-black text-xs uppercase mb-2">
                  Tenaga Ahli Berpengalaman
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Pekerjaan Cepat, Bersih, Higienis, & Bertanggung Jawab
                </h3>
                <p className="text-sm text-slate-300">
                  Didukung peralatan selang panjang bertekanan tinggi yang sanggup mencapai lokasi rumah di dalam gang padat penduduk maupun kompleks perumahan luas di Bekasi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              Jangkauan Layanan Beragam
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Solusi Sanitasi untuk Berbagai Kebutuhan
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Kami menyesuaikan layanan berdasarkan jenis properti dan kebutuhan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SOLUTIONS.map((sol, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:border-[#00C2CB] hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#E0F7F9] text-[#00C2CB] flex items-center justify-center mb-5">
                  {sol.icon === 'home' && <Home className="w-6 h-6" />}
                  {sol.icon === 'building' && <Building2 className="w-6 h-6" />}
                  {sol.icon === 'factory' && <Factory className="w-6 h-6" />}
                  {sol.icon === 'store' && <Store className="w-6 h-6" />}
                </div>

                <h3 className="text-lg font-bold text-[#0A192F] pb-3 mb-4 border-b-2 border-[#E0F7F9]">
                  {sol.category}
                </h3>

                <ul className="space-y-2.5">
                  {sol.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00] shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                    `Halo PT Kusuma Gemilang Raya, saya butuh penanganan sanitasi untuk kategori ${sol.category} di Bekasi.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 block text-xs font-bold text-[#00C2CB] hover:text-[#0A192F] transition-colors"
                >
                  Konsultasi {sol.category} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Area Layanan Section */}
      <section id="area" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              Cakupan Wilayah Lengkap
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Area Layanan Sedot WC Bekasi
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Menjangkau seluruh wilayah Kota Bekasi dan Kabupaten Bekasi dengan respon cepat dan armada terdekat.
            </p>
          </div>

          {/* Interactive Area Checker with Search & Categorization */}
          <AreaChecker />
        </div>
      </section>

      {/* Static Visual Map & Operational Hubs Section */}
      <ServiceAreaMap />

      {/* Pricing Section & Interactive Estimator */}
      <section id="harga" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              Transparan & Kompetitif
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Harga Sedot WC Bekasi
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Kami memberikan harga yang transparan dan kompetitif sesuai kebutuhan lokasi Anda.
            </p>
          </div>

          {/* Official Rate Cards */}
          <div className="max-w-4xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-3xl border-2 border-[#00C2CB]/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#00C2CB]/15 text-[#0A192F]">
                  Toilet & Septic Tank
                </span>
                <span className="text-xs font-bold text-slate-400">Standar Perumahan / Gedung</span>
              </div>
              <h3 className="text-xl font-black text-[#0A192F] mb-1">
                Limbah Black Water (Tinja)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Penyedotan kloset, tinja, & pengurasan septic tank sampai bersih tuntas.
              </p>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Tarif Non Manifest:</span>
                  <span className="text-lg font-black text-[#00C2CB]">Rp 500.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Dengan Manifest Resmi (+400rb):</span>
                  <span className="text-base font-black text-[#0A192F]">Rp 900.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border-2 border-[#FF6B00]/40 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FF6B00]/15 text-[#FF6B00]">
                  STP & Grease Trap
                </span>
                <span className="text-xs font-bold text-slate-400">Komersial & Industri</span>
              </div>
              <h3 className="text-xl font-black text-[#0A192F] mb-1">
                Limbah Grey Water (Lumpur, Lemak)
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Penyedotan lemak dapur resto, lumpur aktif, & limbah cair instalasi STP.
              </p>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Tarif Non Manifest:</span>
                  <span className="text-lg font-black text-[#FF6B00]">Rp 900.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Dengan Manifest Resmi (+400rb):</span>
                  <span className="text-base font-black text-[#0A192F]">Rp 1.300.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Factors */}
          <div className="max-w-4xl mx-auto mb-10">
            <p className="text-center text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
              Faktor Penentu Kondisi Lapangan:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-[#00C2CB] text-center">
                <strong className="block text-base font-bold text-[#0A192F] mb-1">Volume</strong>
                <p className="text-xs text-slate-500">Kapasitas septic tank yang akan disedot.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-[#00C2CB] text-center">
                <strong className="block text-base font-bold text-[#0A192F] mb-1">Lokasi</strong>
                <p className="text-xs text-slate-500">Jarak akses dari pos armada terdekat di Bekasi.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-[#00C2CB] text-center">
                <strong className="block text-base font-bold text-[#0A192F] mb-1">Kesulitan</strong>
                <p className="text-xs text-slate-500">Tingkat kesulitan akses selang ke lokasi septic tank.</p>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border-t-4 border-[#00C2CB] text-center">
                <strong className="block text-base font-bold text-[#0A192F] mb-1">Jenis Layanan</strong>
                <p className="text-xs text-slate-500">Sedot WC, pelancaran saluran mampet, atau STP.</p>
              </div>
            </div>
          </div>

          {/* Interactive Estimator Component */}
          <div className="max-w-3xl mx-auto">
            <PriceEstimator />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              SOP Terstandar
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Proses Layanan Kami
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Empat langkah mudah untuk menyelesaikan masalah sanitasi Anda tanpa repot.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative mb-12">
            {PROCESS_STEPS.map((step) => (
              <div key={step.num} className="text-center group">
                <div className="w-16 h-16 rounded-full bg-white text-[#FF6B00] border-4 border-[#FF6B00] font-black text-2xl flex items-center justify-center mx-auto mb-6 shadow-md group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                  {step.num}
                </div>
                <h4 className="text-lg font-bold text-[#0A192F] mb-2">{step.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Equipment Showcase Card */}
          <div className="bg-gradient-to-r from-[#0A192F] to-[#172A45] rounded-3xl overflow-hidden shadow-xl border border-slate-800 text-white grid grid-cols-1 md:grid-cols-2 items-center">
            <div className="p-8 sm:p-10 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-[#00C2CB]/20 text-[#00C2CB] text-xs font-bold border border-[#00C2CB]/30 uppercase tracking-wider">
                Teknologi & Peralatan Canggih
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Peralatan Mesin Spiral & High Pressure Jetting Modern
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Kami menggunakan mesin spiral drain cleaner khusus dan pompa vakum berkekuatan tinggi buatan pabrik berstandar industri. Mampu membersihkan kotoran kerak lemak keras di saluran pipa tanpa harus membongkar lantai keramik rumah Anda.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-cyan-200">
                <span className="flex items-center gap-1.5">✓ Tanpa Merusak Pipa</span>
                <span className="flex items-center gap-1.5">✓ Selang Spiral Panjang</span>
                <span className="flex items-center gap-1.5">✓ Pengerjaan Cepat</span>
              </div>
            </div>
            <div className="h-64 md:h-full min-h-[260px] relative">
              <img
                src={CONTACT_INFO.equipmentImg}
                alt="Peralatan Mesin Sedot WC & Pelancar Saluran Modern"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0A192F] via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Legalitas Section */}
      <section id="dokumentasi" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0A192F] to-[#172A45] text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-[#00C2CB]/10 blur-2xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2CB]/20 text-[#00C2CB] text-xs font-bold border border-[#00C2CB]/30">
                  <Award className="w-4 h-4" /> Legalitas & Kredibilitas Resmi
                </div>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  PT Kusuma Gemilang Raya
                </h2>

                <p className="text-slate-300 text-base leading-relaxed">
                  PT. Kusuma Gemilang Raya adalah perusahaan jasa resmi dengan legalitas lengkap. Kami melayani sedot WC, pengangkutan limbah, serta perawatan dan perbaikan IPAL di Kota Bekasi dan seluruh Kabupaten Bekasi. Limbah Anda ditangani secara profesional, legal, dan sesuai aturan lingkungan.
                </p>

                <div className="pt-2">
                  <a
                    href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                      'Halo PT Kusuma Gemilang Raya, saya ingin verifikasi legalitas dan order layanan sanitasi di Bekasi.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold text-sm shadow-md transition-all"
                  >
                    <FileCheck2 className="w-4 h-4" /> Hubungi Kami Resmi
                  </a>
                </div>
              </div>

              {/* Legal Details Card */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm space-y-4">
                <h3 className="text-lg font-bold text-[#00C2CB] border-b border-white/10 pb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#00C2CB]" /> Dokumen Perusahaan Resmi:
                </h3>
                <ul className="space-y-3.5 text-sm">
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-[#00C2CB] font-bold min-w-[140px]">Nama Perusahaan:</span>
                    <span className="text-white font-semibold">PT Kusuma Gemilang Raya</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-[#00C2CB] font-bold min-w-[140px]">Legalitas & Izin:</span>
                    <span className="text-white">NIB KBLI 37011, Sertifikat Standar, SPPKP</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-[#00C2CB] font-bold min-w-[140px]">Bidang Usaha:</span>
                    <span className="text-white">Jasa Sanitasi, Pengolahan & Pembuangan Air Limbah</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-[#00C2CB] font-bold min-w-[140px]">Wilayah Layanan:</span>
                    <span className="text-white">Kota & Seluruh Kabupaten Bekasi</span>
                  </li>
                  <li className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                    <span className="text-[#00C2CB] font-bold min-w-[140px]">Kontak Resmi:</span>
                    <span className="text-white font-bold text-[#FF6B00]">{CONTACT_INFO.phoneDisplay}</span>
                  </li>
                </ul>

                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Tersedia Faktur Pajak & Kuitansi Berstempel Resmi untuk Perusahaan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Field Work Photo Gallery Section */}
      <WorkGallery />

      {/* Testimonials Slider Section */}
      <TestimonialSlider />

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              Tanya Jawab
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Informasi penting seputar layanan sedot WC dan septic tank di Bekasi.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              
              // Dynamic descriptive styling & icon configurations per FAQ type
              const getFaqQuestionIcon = (faqItem: typeof faq) => {
                const iconClass = "w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110";
                
                if (faqItem.highlightType === 'pricing' || faqItem.iconName === 'BadgeDollarSign') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/15 text-amber-600 border border-amber-300/60 shadow-2xs shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-all">
                      <Receipt className="w-3.5 h-3.5" />
                    </span>
                  );
                }
                
                if (faqItem.highlightType === 'guarantee' || faqItem.iconName === 'Award') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-orange-500/15 text-orange-600 border border-orange-300/60 shadow-2xs shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <Award className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                if (faqItem.highlightType === 'safety' || faqItem.iconName === 'ShieldCheck') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 border border-emerald-300/60 shadow-2xs shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                if (faqItem.iconName === 'MapPin') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-cyan-500/15 text-cyan-600 border border-cyan-300/60 shadow-2xs shrink-0 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                if (faqItem.iconName === 'Truck') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-blue-500/15 text-blue-600 border border-blue-300/60 shadow-2xs shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                      <Truck className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                if (faqItem.iconName === 'Droplet') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-teal-500/15 text-teal-600 border border-teal-300/60 shadow-2xs shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-all">
                      <Droplet className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                if (faqItem.iconName === 'Wrench') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-500/15 text-indigo-600 border border-indigo-300/60 shadow-2xs shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                      <Wrench className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                if (faqItem.iconName === 'Clock') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-violet-500/15 text-violet-600 border border-violet-300/60 shadow-2xs shrink-0 group-hover:bg-violet-500 group-hover:text-white transition-all">
                      <Clock className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                if (faqItem.iconName === 'Building2') {
                  return (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-500/15 text-slate-600 border border-slate-300/60 shadow-2xs shrink-0 group-hover:bg-slate-700 group-hover:text-white transition-all">
                      <Building2 className="w-3.5 h-3.5" />
                    </span>
                  );
                }

                return (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-100 text-slate-600 border border-slate-200 shadow-2xs shrink-0">
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                );
              };

              // Helper to resolve icon component with styling per FAQ type
              const getFaqIcon = (name?: string) => {
                const iconClass = "w-4 h-4";
                switch (name) {
                  case 'BadgeDollarSign':
                    return <BadgeDollarSign className={iconClass} />;
                  case 'ShieldCheck':
                    return <ShieldCheck className={iconClass} />;
                  case 'Award':
                    return <Award className={iconClass} />;
                  case 'MapPin':
                    return <MapPin className={iconClass} />;
                  case 'Truck':
                    return <Truck className={iconClass} />;
                  case 'Droplet':
                    return <Droplet className={iconClass} />;
                  case 'CheckCircle2':
                    return <CheckCircle2 className={iconClass} />;
                  case 'Wrench':
                    return <Wrench className={iconClass} />;
                  case 'Clock':
                    return <Clock className={iconClass} />;
                  case 'Building2':
                    return <Building2 className={iconClass} />;
                  default:
                    return <ShieldCheck className={iconClass} />;
                }
              };

              const isPricing = faq.highlightType === 'pricing' || faq.iconName === 'BadgeDollarSign';
              const isGuarantee = faq.highlightType === 'guarantee' || faq.iconName === 'Award';
              const isSafety = faq.highlightType === 'safety' || faq.iconName === 'ShieldCheck';
              const isPriority = isPricing || isGuarantee || isSafety;

              return (
                <div
                  key={idx}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isOpen 
                      ? isPricing
                        ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20'
                        : isGuarantee
                          ? 'border-orange-400 shadow-md ring-2 ring-orange-400/20'
                          : isSafety
                            ? 'border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
                            : 'border-[#00C2CB] shadow-md ring-2 ring-[#00C2CB]/10' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 font-bold text-base text-[#0A192F] cursor-pointer hover:text-[#00C2CB] transition-colors group"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 flex-1">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-2xs ${
                          isPricing
                            ? isOpen
                              ? 'bg-amber-500 text-white shadow-sm'
                              : 'bg-amber-500/15 text-amber-700'
                            : isGuarantee
                              ? isOpen
                                ? 'bg-[#FF6B00] text-white shadow-sm'
                                : 'bg-[#FF6B00]/15 text-[#FF6B00]'
                              : isSafety
                                ? isOpen
                                  ? 'bg-emerald-600 text-white shadow-sm'
                                  : 'bg-emerald-500/15 text-emerald-700'
                                : isOpen
                                  ? 'bg-[#00C2CB] text-white shadow-sm'
                                  : 'bg-[#00C2CB]/15 text-[#00C2CB]'
                        }`}
                        title={faq.category || 'FAQ'}
                      >
                        {getFaqIcon(faq.iconName)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                          {faq.category && (
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                isPricing
                                  ? 'bg-amber-100 text-amber-800'
                                  : isGuarantee
                                    ? 'bg-[#FF6B00]/10 text-[#FF6B00]'
                                    : isSafety
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {faq.category}
                            </span>
                          )}
                          {faq.badge && (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border shadow-2xs tracking-tight ${
                                faq.badge === 'Verified'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-1 ring-emerald-400/20'
                                  : 'bg-sky-50 text-sky-700 border-sky-300 ring-1 ring-sky-400/20'
                              }`}
                              title={`${faq.badge} oleh PT Kusuma Gemilang Raya`}
                            >
                              {faq.badge === 'Verified' ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              ) : (
                                <ShieldCheck className="w-3 h-3 text-sky-600 shrink-0" />
                              )}
                              <span>{faq.badge}</span>
                            </span>
                          )}
                          {isPricing && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              <Receipt className="w-2.5 h-2.5" />
                              <span>Tarif Resmi</span>
                            </span>
                          )}
                          {isGuarantee && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                              <Award className="w-2.5 h-2.5" />
                              <span>Jaminan Penuh</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-start sm:items-center gap-2">
                          {/* Small dynamic descriptive icon next to question */}
                          {getFaqQuestionIcon(faq)}
                          <span className="block text-sm sm:text-base font-bold leading-snug text-[#0A192F] group-hover:text-[#00C2CB] transition-colors">
                            {faq.q}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-[#00C2CB] shrink-0 mt-1 sm:mt-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                      <div className="pt-3.5 pl-0 sm:pl-[49px]">
                        <p>{faq.a}</p>
                        {faq.badge && (
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-700">
                            <span
                              className={`inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0 ${
                                faq.badge === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'
                              }`}
                            >
                              {faq.badge === 'Verified' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                              )}
                            </span>
                            <span>
                              {faq.badge === 'Verified'
                                ? 'Standar SOP Keamanan & Higienitas Resmi Terverifikasi'
                                : 'Jaminan Resmi Bersertifikat & Bergaransi PT Kusuma Gemilang Raya'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-slate-500 mb-3">Punya pertanyaan lain yang belum terjawab?</p>
            <a
              href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(
                'Halo PT Kusuma Gemilang Raya, saya mau tanya seputar layanan sedot WC di Bekasi.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00] hover:text-[#E65F00] transition-colors"
            >
              <span>Chat langsung dengan CS kami via WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Section Strip Banner Mitra & Asosiasi Jasa Sanitasi */}
      <SanitationPartnersBanner />

      {/* Final CTA Section */}
      <section id="kontak" className="py-20 bg-[#FF6B00] text-white text-center relative overflow-hidden">
        {/* Subtle background circle decoration */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-black/10 blur-2xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
            Septic Tank Penuh atau WC Mampet?
          </h2>
          
          <p className="text-base sm:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed mb-8">
            Hubungi PT Kusuma Gemilang Raya untuk mendapatkan informasi dan penjadwalan layanan sedot WC Bekasi.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={currentWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-source="final_cta_whatsapp"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#0A192F] hover:bg-white text-white hover:text-[#0A192F] font-black text-lg transition-all shadow-xl hover:scale-105"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>WhatsApp Sekarang</span>
            </a>

            <a
              href={`tel:${CONTACT_INFO.phoneRaw}`}
              data-cta-source="final_cta_call"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold text-base transition-all border border-white/30"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Telepon Langsung ({CONTACT_INFO.phoneDisplay})</span>
            </a>
          </div>

          <div className="mt-6 text-xl sm:text-2xl font-black text-white tracking-wider">
            {CONTACT_INFO.phoneDisplay}
          </div>
          <p className="text-xs text-white/80 mt-1">Layanan 24 Jam Siap Antar Armada ke Lokasi Anda</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A192F] text-slate-400 pt-16 pb-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            
            {/* Col 1: About */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={CONTACT_INFO.logoUrl}
                  alt="PT Kusuma Gemilang Raya Logo"
                  className="w-10 h-10 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <h3 className="text-white font-bold text-lg uppercase tracking-tight">
                  PT KUSUMA GEMILANG RAYA
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-300 max-w-md">
                Jasa Sedot WC Bekasi & Sekitarnya. Profesional, resmi, dan terpercaya untuk kebutuhan sanitasi rumah tangga, ruko, perkantoran, dan industri pabrik.
              </p>
              <div className="text-xs text-slate-400 space-y-1">
                <p>✓ NIB KBLI 37011 • Sertifikat Standar • SPPKP</p>
                <p>✓ Armada Modern • Selang Panjang • Tanpa Bau & Bersih</p>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Menu Cepat</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#beranda" className="hover:text-[#00C2CB] transition-colors">Beranda</a></li>
                <li><a href="#tentang" className="hover:text-[#00C2CB] transition-colors">Tentang Kami</a></li>
                <li><a href="#layanan" className="hover:text-[#00C2CB] transition-colors">Layanan Utama</a></li>
                <li><a href="#sektor-spesialis" className="hover:text-[#00C2CB] transition-colors">Sektor Spesialis</a></li>
                <li><a href="#area" className="hover:text-[#00C2CB] transition-colors">Area Layanan</a></li>
                <li><a href="#harga" className="hover:text-[#00C2CB] transition-colors">Harga & Estimasi</a></li>
                <li><a href="#dokumentasi" className="hover:text-[#00C2CB] transition-colors">Dokumentasi & Legalitas</a></li>
                <li><a href="#galeri" className="hover:text-[#00C2CB] transition-colors">Galeri Lapangan</a></li>
                <li><a href="#testimoni" className="hover:text-[#00C2CB] transition-colors">Testimoni Klien</a></li>
                <li><a href="#faq" className="hover:text-[#00C2CB] transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Col 3: Contact Details */}
            <div className="space-y-3">
              <h4 className="text-white font-bold text-sm uppercase tracking-wider">Kontak & Layanan</h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <span className="block text-xs text-slate-400">WhatsApp / Telp:</span>
                  <a href={currentWaUrl} target="_blank" rel="noopener noreferrer" data-cta-source="footer_wa" className="text-white hover:text-[#00C2CB] font-bold text-base transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </li>
                <li>
                  <span className="block text-xs text-slate-400">Wilayah Layanan:</span>
                  <span className="text-white">Kota & Kabupaten Bekasi, Jawa Barat</span>
                </li>
                <li>
                  <span className="block text-xs text-slate-400">Jam Operasional:</span>
                  <span className="text-white font-semibold">24 Jam Non-Stop (Setiap Hari)</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>&copy; {new Date().getFullYear()} PT Kusuma Gemilang Raya. All Rights Reserved. Jasa Sedot WC Bekasi Resmi.</p>
            <button
              onClick={() => setShowMarketingModal(true)}
              className="text-[11px] text-slate-600 hover:text-[#00C2CB] underline cursor-pointer transition-colors"
              title="Tekan Ctrl+Shift+M atau klik di sini untuk evaluasi data konversi"
            >
              Evaluasi Pemasaran & Konversi
            </button>
          </div>
        </div>
      </footer>

      {/* Subtle Back to Top Button */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Kembali ke atas halaman"
        className={`fixed z-40 transition-all duration-300 flex items-center justify-center rounded-full bg-[#0A192F]/85 hover:bg-[#0A192F] text-white shadow-lg hover:shadow-xl backdrop-blur-md border border-white/20 active:scale-90 cursor-pointer ${
          showBackToTop 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        } bottom-24 right-4 w-11 h-11 md:bottom-25 md:right-8 md:w-12 md:h-12 group`}
      >
        <ArrowUp className="w-5 h-5 text-[#00C2CB] group-hover:-translate-y-0.5 transition-transform" />
        
        {/* Subtle tooltip on hover */}
        <span className="absolute right-14 whitespace-nowrap bg-[#0A192F] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
          Ke Atas
        </span>
      </button>

      {/* Desktop Floating WhatsApp Action Button */}
      <a
        href={desktopWaUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-cta-source="floating_desktop_wa"
        aria-label="Hubungi WhatsApp PT Kusuma Gemilang Raya"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center justify-center w-16 h-16 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 active:scale-95 transition-all wa-pulse group cursor-pointer"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>

        {/* Floating Tooltip */}
        <span className="absolute right-20 whitespace-nowrap bg-[#0A192F] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
          Chat WhatsApp (Pesan Otomatis: {SECTION_CONTEXTS[activeSection]?.name || 'Online 24 Jam'})
        </span>
      </a>

      {/* Floating Action Bar Khusus Perangkat Mobile */}
      <aside aria-label="Aksi Cepat Mobile" className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-5px_25px_rgba(0,0,0,0.15)] px-3 pt-2 pb-3">
        {/* Status mini bar */}
        <div className="flex items-center justify-between px-1 mb-1.5 text-[10px] font-bold text-slate-500">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Armada Siaga 24 Jam Non-Stop
          </span>
          <button
            type="button"
            onClick={() => {
              setAutoCountdown(false);
              setShowAutoRedirectModal(true);
            }}
            className="text-[10px] text-[#00C2CB] hover:underline flex items-center gap-1 font-extrabold cursor-pointer"
            title="Deteksi perangkat & personalisasi pesan WhatsApp"
          >
            <Sparkles className="w-3 h-3 text-[#FF6B00]" />
            <span>Auto-Redirect ({SECTION_CONTEXTS[activeSection]?.badge || 'Aktif'})</span>
          </button>
        </div>

        {/* Dual CTA Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Tombol Panggil Sekarang */}
          <a
            href={`tel:${CONTACT_INFO.phoneRaw}`}
            data-cta-source="mobile_floating_call"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#0A192F] active:bg-[#172A45] text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98]"
            aria-label="Panggil Sekarang via Telepon"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
              <PhoneCall className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-left leading-tight">
              <span className="block text-[11px] font-black uppercase tracking-wide">Panggil Sekarang</span>
              <span className="text-[10px] text-slate-300 font-normal">{CONTACT_INFO.phoneDisplay}</span>
            </div>
          </a>

          {/* Tombol Chat WA */}
          <a
            href={mobileWaUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cta-source="mobile_floating_wa"
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-[#25D366] active:bg-[#20ba59] text-white font-extrabold text-xs shadow-md transition-all active:scale-[0.98]"
            aria-label="Chat WhatsApp PT Kusuma Gemilang Raya"
          >
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
            <div className="text-left leading-tight">
              <span className="block text-[11px] font-black uppercase tracking-wide">Chat WA</span>
              <span className="text-[10px] text-emerald-100 font-normal">Pesan Otomatis</span>
            </div>
          </a>
        </div>
      </aside>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
      />

      {/* Auto-Redirect Floating Widget for Desktop */}
      <AutoRedirectFloatingWidget
        device={deviceInfo}
        activeSectionId={activeSection}
        onOpenModal={() => {
          setAutoCountdown(false);
          setShowAutoRedirectModal(true);
        }}
      />

      {/* Auto-Redirect Smart Modal */}
      <AutoRedirectModal
        isOpen={showAutoRedirectModal}
        onClose={() => setShowAutoRedirectModal(false)}
        activeSectionId={activeSection}
        autoStartCountdown={autoCountdown}
      />

      {/* Marketing Analytics Evaluation Modal */}
      <MarketingAnalyticsModal
        isOpen={showMarketingModal}
        onClose={() => setShowMarketingModal(false)}
      />
    </div>
  );
}
