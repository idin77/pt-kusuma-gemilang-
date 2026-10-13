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
  HelpCircle,
  Search,
  Share2,
  Link2,
  Copy,
  Printer,
  FileSpreadsheet,
  Download,
  BookOpen,
  ArrowUpDown,
  Info,
  Layers
} from 'lucide-react';
import { 
  CONTACT_INFO, 
  SERVICES, 
  WHY_US, 
  SOLUTIONS, 
  PROCESS_STEPS, 
  FAQS, 
  FaqItem,
  ServiceItem 
} from './data/websiteData';
import ServiceModal from './components/ServiceModal';
import PriceEstimator from './components/PriceEstimator';
import AreaChecker from './components/AreaChecker';
import ServiceAreaMap from './components/ServiceAreaMap';
import TestimonialSlider from './components/TestimonialSlider';
import WorkGallery from './components/WorkGallery';
import SpecialistSectors from './components/SpecialistSectors';
import IpltManifestSection from './components/IpltManifestSection';
import SanitationPartnersBanner from './components/SanitationPartnersBanner';
import CorporateClientsSection from './components/CorporateClientsSection';
import MarketingAnalyticsModal from './components/MarketingAnalyticsModal';
import PrintFaqModal from './components/PrintFaqModal';
import FaqSocialShare from './components/FaqSocialShare';
import AutoRedirectModal from './components/AutoRedirectModal';
import AutoRedirectFloatingWidget from './components/AutoRedirectFloatingWidget';
import InstantEstimateButton from './components/InstantEstimateButton';
import { FaqVoiceSearchButton } from './components/FaqVoiceSearchButton';
import { exportFaqsToCsv } from './utils/exportCsv';
import { playFaqClickSound } from './utils/soundEffects';
import { calculateFaqReadingTime } from './utils/readingTime';
import { useVoiceSearch } from './utils/useVoiceSearch';
import { initConversionTracking } from './utils/conversionTracker';
import { 
  detectDevice, 
  DeviceInfo, 
  WhatsAppContext,
  generateIntelligentWaTemplate,
  generatePersonalizedWaMessage, 
  getOptimizedWhatsAppUrl, 
  SECTION_CONTEXTS,
  executeAutoRedirect,
  updateActiveContext 
} from './utils/whatsappRedirect';
import { motion, type Variants } from 'framer-motion';

// Framer Motion subtle slide-up stagger animation variants for FAQ items
const faqStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.02
    }
  }
};

const faqStaggerItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 16 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  }
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [faqSearchQuery, setFaqSearchQuery] = useState<string>('');
  const [faqCategoryFilter, setFaqCategoryFilter] = useState<string>('Semua');
  const [faqSortOrder, setFaqSortOrder] = useState<'recent' | 'alphabetical'>('recent');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showMarketingModal, setShowMarketingModal] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(detectDevice());
  const [activeSection, setActiveSection] = useState<string>('beranda');
  const [interactionContext, setInteractionContext] = useState<WhatsAppContext>({
    sectionId: 'beranda',
    urgency: 'hari_ini',
    district: 'Bekasi Barat'
  });
  const [showAutoRedirectModal, setShowAutoRedirectModal] = useState<boolean>(false);
  const [autoCountdown, setAutoCountdown] = useState<boolean>(false);
  const [showPrintFaqModal, setShowPrintFaqModal] = useState<boolean>(false);
  const [copiedFaqId, setCopiedFaqId] = useState<string | null>(null);

  // Voice Search integration using Web Speech API for #faq-printable-area search input
  const landingVoiceSearch = useVoiceSearch({
    lang: 'id-ID',
    onTranscriptChange: (text) => {
      setFaqSearchQuery(text);
      if (text.trim().length > 1) {
        const firstMatch = FAQS.find(
          item => item.q.toLowerCase().includes(text.toLowerCase()) || 
                  item.a.toLowerCase().includes(text.toLowerCase())
        );
        if (firstMatch) {
          setActiveFaq(firstMatch.q);
        }
      }
    },
    onFinalTranscript: (text) => {
      setFaqSearchQuery(text);
      if (text.trim().length > 1) {
        const firstMatch = FAQS.find(
          item => item.q.toLowerCase().includes(text.toLowerCase()) || 
                  item.a.toLowerCase().includes(text.toLowerCase())
        );
        if (firstMatch) {
          setActiveFaq(firstMatch.q);
        }
      }
    },
  });

  // Deep linking: Dengarkan perubahan hash URL untuk membuka dan scroll ke FAQ tertentu (#faq-harga-biaya-bekasi atau #faq-1)
  useEffect(() => {
    const handleFaqAnchorFromHash = () => {
      if (typeof window === 'undefined') return;
      const hash = window.location.hash;
      if (hash && hash.startsWith('#faq-')) {
        const rawId = hash.replace('#faq-', '').toLowerCase().trim();
        const found = FAQS.find((item, idx) => 
          (item.id && item.id.toLowerCase() === rawId) ||
          String(idx + 1) === rawId
        );
        if (found) {
          setActiveFaq(found.q);
          setTimeout(() => {
            const targetEl = document.getElementById(hash.substring(1));
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      }
    };

    handleFaqAnchorFromHash();
    window.addEventListener('hashchange', handleFaqAnchorFromHash);
    return () => window.removeEventListener('hashchange', handleFaqAnchorFromHash);
  }, []);

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
      'manifest-iplt',
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
            updateActiveContext({ sectionId: id });
            setInteractionContext(prev => ({ ...prev, sectionId: id }));
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

  const toggleFaq = (questionText: string) => {
    setActiveFaq(activeFaq === questionText ? null : questionText);
  };

  // Salin URL dengan anchor spesifik (#faq-id) langsung ke clipboard
  const handleCopyFaqLink = (e: React.MouseEvent, faq: FaqItem, idx: number) => {
    e.stopPropagation();
    const anchorSlug = faq.id || String(idx + 1);
    const anchorId = `faq-${anchorSlug}`;
    
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const fullUrl = `${origin}${pathname}#${anchorId}`;

      const doCopy = () => {
        setCopiedFaqId(anchorId);
        window.history.pushState(null, '', `#${anchorId}`);
        if (activeFaq !== faq.q) {
          setActiveFaq(faq.q);
        }
        setTimeout(() => {
          setCopiedFaqId(prev => (prev === anchorId ? null : prev));
        }, 2500);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(fullUrl).then(doCopy).catch(() => {
          // Fallback jika permission browser terbatas
          prompt('Salin tautan FAQ berikut:', fullUrl);
        });
      } else {
        prompt('Salin tautan FAQ berikut:', fullUrl);
      }
    }
  };

  // Helper text highlighter for FAQ search query
  const highlightFaqMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-amber-950 font-bold px-0.5 rounded shadow-2xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // Real-time filtered FAQ items
  const filteredFaqs = FAQS.filter((faq) => {
    const qLower = faq.q.toLowerCase();
    const aLower = faq.a.toLowerCase();
    const catLower = (faq.category || '').toLowerCase();
    const searchLower = faqSearchQuery.toLowerCase().trim();

    const matchesSearch =
      !searchLower ||
      qLower.includes(searchLower) ||
      aLower.includes(searchLower) ||
      catLower.includes(searchLower);

    const matchesCategory =
      faqCategoryFilter === 'Semua' ||
      (faqCategoryFilter === 'Tips Perawatan' && (faq.highlightType === 'maintenance' || catLower.includes('perawatan') || catLower.includes('tips') || catLower.includes('cegah'))) ||
      (faqCategoryFilter === 'Harga & Biaya' && (faq.highlightType === 'pricing' || catLower.includes('harga'))) ||
      (faqCategoryFilter === 'Jaminan Garansi' && (faq.highlightType === 'guarantee' || catLower.includes('garansi'))) ||
      (faqCategoryFilter === 'SOP Keamanan (APD)' && (faq.highlightType === 'safety' || catLower.includes('keamanan') || catLower.includes('sop') || catLower.includes('apd'))) ||
      (faqCategoryFilter === 'Cakupan Wilayah' && (faq.highlightType === 'location' || catLower.includes('wilayah') || catLower.includes('cikarang'))) ||
      (faqCategoryFilter === 'Legalitas & IPLT' && (catLower.includes('manifest') || catLower.includes('legalitas') || faq.iconName === 'FileCheck')) ||
      faq.category === faqCategoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Sorted FAQ items based on selected sort order ('recent' or 'alphabetical')
  const sortedFaqs = React.useMemo(() => {
    const list = [...filteredFaqs];
    if (faqSortOrder === 'alphabetical') {
      list.sort((a, b) => a.q.localeCompare(b.q, 'id', { sensitivity: 'base' }));
    }
    // 'recent' maintains curated chronological/priority order
    return list;
  }, [filteredFaqs, faqSortOrder]);

  // Dynamically calculate estimated reading time based on content length of currently displayed FAQs
  const faqReadingTime = React.useMemo(() => {
    return calculateFaqReadingTime(sortedFaqs);
  }, [sortedFaqs]);

  const effectiveContext: WhatsAppContext = {
    ...interactionContext,
    sectionId: activeSection
  };

  const currentPersonalizedWaMessage = generateIntelligentWaTemplate(effectiveContext, deviceInfo.deviceType);
  const currentWaUrl = getOptimizedWhatsAppUrl(currentPersonalizedWaMessage, deviceInfo.isMobile);
  const mobileWaUrl = getOptimizedWhatsAppUrl(generateIntelligentWaTemplate(effectiveContext, 'mobile'), true);
  const desktopWaUrl = getOptimizedWhatsAppUrl(generateIntelligentWaTemplate(effectiveContext, 'desktop'), false);

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
              <li><a href="#manifest-iplt" className="hover:text-[#00C2CB] transition-colors">Manifest IPLT</a></li>
              <li><a href="#galeri" className="hover:text-[#00C2CB] transition-colors">Galeri</a></li>
              <li><a href="#testimoni" className="hover:text-[#00C2CB] transition-colors">Testimoni</a></li>
              <li><a href="#klien" className="hover:text-[#00C2CB] transition-colors">Klien Rekanan</a></li>
              <li><a href="#faq" className="hover:text-[#00C2CB] transition-colors">FAQ</a></li>
              <li><a href="#kontak" className="hover:text-[#00C2CB] transition-colors">Hubungi Kami</a></li>
            </ul>

            {/* Header Right Action */}
            <div className="hidden sm:flex items-center gap-2.5">
              <InstantEstimateButton
                buttonText="Estimasi Instan"
                size="sm"
                variant="header"
                source="header_instant_estimate"
                className="hidden xl:inline-flex"
              />

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
              <li><a href="#manifest-iplt" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Dokumen Manifest IPLT</a></li>
              <li><a href="#galeri" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Galeri Foto Lapangan</a></li>
              <li><a href="#testimoni" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Testimoni Klien</a></li>
              <li><a href="#klien" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Klien Rekanan (15+ Perusahaan)</a></li>
              <li><a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">FAQ</a></li>
              <li><a href="#kontak" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-[#00C2CB]">Hubungi Kami</a></li>
            </ul>

            <div className="pt-3 border-t border-slate-100 space-y-2">
              <InstantEstimateButton
                buttonText="Dapatkan Estimasi Instan (3 Langkah)"
                size="md"
                variant="accent"
                source="mobile_drawer_instant_estimate"
                className="w-full justify-center"
              />

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
              <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <InstantEstimateButton
                  buttonText="Dapatkan Estimasi Instan"
                  size="lg"
                  variant="primary"
                  source="hero_instant_estimate"
                  className="w-full sm:w-auto shadow-xl hover:shadow-orange-500/30 font-black"
                />

                <a
                  href={currentWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta-source="hero_cta"
                  className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#0A192F] hover:bg-[#172A45] text-white font-black text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
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
                  <span>Auto-Redirect WA</span>
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
                    onClick={() => {
                      setSelectedService(srv);
                      const srvCtx = { sectionId: 'layanan', serviceId: srv.id, serviceTitle: srv.title, urgency: 'hari_ini' as const };
                      setInteractionContext(srvCtx);
                      updateActiveContext(srvCtx);
                    }}
                    className="inline-flex items-center gap-1.5 font-bold text-sm text-[#FF6B00] hover:text-[#E65F00] transition-colors cursor-pointer group/btn"
                  >
                    <span>Lihat Detail</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <a
                    href={getOptimizedWhatsAppUrl(
                      generateIntelligentWaTemplate({
                        sectionId: 'layanan',
                        serviceId: srv.id,
                        serviceTitle: srv.title,
                        urgency: 'hari_ini'
                      }, deviceInfo.deviceType),
                      deviceInfo.isMobile
                    )}
                    onClick={() => {
                      const srvCtx = { sectionId: 'layanan', serviceId: srv.id, serviceTitle: srv.title, urgency: 'hari_ini' as const };
                      setInteractionContext(srvCtx);
                      updateActiveContext(srvCtx);
                      executeAutoRedirect(srvCtx, `service_card_${srv.id}`);
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#008c94] hover:text-[#00C2CB] transition-colors flex items-center gap-1 cursor-pointer"
                    title={`Pesan langsung ${srv.title} via pesan cerdas WhatsApp`}
                  >
                    <span>Pesan WA Otomatis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
                  href={getOptimizedWhatsAppUrl(
                    generateIntelligentWaTemplate({
                      sectionId: 'sektor-spesialis',
                      sectorCategory: sol.category,
                      urgency: 'hari_ini'
                    }, deviceInfo.deviceType),
                    deviceInfo.isMobile
                  )}
                  onClick={() => {
                    const solCtx = { sectionId: 'sektor-spesialis', sectorCategory: sol.category, urgency: 'hari_ini' as const };
                    setInteractionContext(solCtx);
                    updateActiveContext(solCtx);
                    executeAutoRedirect(solCtx, `sector_card_${sol.category}`);
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#00C2CB] hover:text-[#0A192F] transition-colors"
                  title={`Konsultasi khusus ${sol.category} dengan template pesan WhatsApp otomatis`}
                >
                  <span>Konsultasi {sol.category} (WA Otomatis)</span>
                  <ArrowRight className="w-3 h-3" />
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
          <div className="max-w-5xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Black Water */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#00C2CB]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#00C2CB]/15 text-[#0A192F]">
                    Toilet & Septic Tank
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Hunian & Gedung</span>
                </div>
                <h3 className="text-lg font-black text-[#0A192F] mb-1">
                  Limbah Black Water (Tinja)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Penyedotan kloset, tinja, & pengurasan septic tank sampai bersih tuntas.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Non Manifest:</span>
                  <span className="text-base font-black text-[#00C2CB]">Rp 700.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Dengan Manifest:</span>
                  <span className="text-base font-black text-[#0A192F]">Rp 1.100.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
              </div>
            </div>

            {/* 2. Grey Water */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#FF6B00]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#FF6B00]/15 text-[#FF6B00]">
                    STP & Grease Trap
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Komersial & Resto</span>
                </div>
                <h3 className="text-lg font-black text-[#0A192F] mb-1">
                  Limbah Grey Water (Lumpur, Lemak)
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Penyedotan lemak dapur resto, lumpur limbah cair, & instalasi STP.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Non Manifest:</span>
                  <span className="text-base font-black text-[#FF6B00]">Rp 1.100.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Dengan Manifest:</span>
                  <span className="text-base font-black text-[#0A192F]">Rp 1.500.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
              </div>
            </div>

            {/* 3. Cleaning / Blower Lumpur */}
            <div className="bg-white p-6 rounded-3xl border-2 border-[#008c94]/40 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-[#008c94]/15 text-[#008c94]">
                    Spesialis Kerak Keras
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">Endapan & Lumpur</span>
                </div>
                <h3 className="text-lg font-black text-[#0A192F] mb-1">
                  Cleaning / Blower Lumpur
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Blower pengencer lumpur beku, kuras endapan lumpur padat & kerak septic tank.
                </p>
              </div>
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Non Manifest:</span>
                  <span className="text-base font-black text-[#008c94]">Rp 1.100.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600">Dengan Manifest:</span>
                  <span className="text-base font-black text-[#0A192F]">Rp 1.500.000 <span className="text-xs font-normal text-slate-500">/ kubik</span></span>
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

          {/* Quick 3-Step Instant Estimate Lead Form Banner */}
          <div className="max-w-3xl mx-auto mb-8 bg-gradient-to-r from-[#0A192F] via-[#102A4C] to-[#0A192F] text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 border border-white/10">
            <div className="text-center sm:text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#00C2CB] block mb-1">
                Formulir Cepat 3 Langkah
              </span>
              <h4 className="text-lg font-black text-white">Butuh Estimasi Biaya Cepat & Praktis?</h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Isi nama, no. WhatsApp, & layanan untuk mendapatkan kalkulasi estimasi langsung tanpa repot.
              </p>
            </div>
            <InstantEstimateButton
              buttonText="Dapatkan Estimasi Instan"
              size="md"
              variant="accent"
              source="price_section_instant_estimate"
              className="shrink-0 shadow-lg"
            />
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
                    href={getOptimizedWhatsAppUrl(
                      generateIntelligentWaTemplate({
                        sectionId: 'tentang',
                        customNotes: 'Verifikasi legalitas NIB KBLI 37011, bukti setor IPLT, dan faktur pajak SPPKP',
                        urgency: 'hari_ini'
                      }, deviceInfo.deviceType),
                      deviceInfo.isMobile
                    )}
                    onClick={() => {
                      const legalCtx = {
                        sectionId: 'tentang',
                        customNotes: 'Verifikasi legalitas NIB KBLI 37011, bukti setor IPLT, dan faktur pajak SPPKP',
                        urgency: 'hari_ini' as const
                      };
                      setInteractionContext(legalCtx);
                      updateActiveContext(legalCtx);
                      executeAutoRedirect(legalCtx, 'legal_section_cta');
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <FileCheck2 className="w-4 h-4" /> Hubungi Kami Resmi (WA Otomatis)
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

      {/* Visualisasi Dokumen Manifest Resmi IPLT */}
      <IpltManifestSection />

      {/* Field Work Photo Gallery Section */}
      <WorkGallery />

      {/* Testimonials Slider Section */}
      <TestimonialSlider />

      {/* Corporate Clients & Industrial Partners Showcase Section */}
      <CorporateClientsSection />

      {/* FAQ Section with Real-Time Search & Category Filters */}
      <section id="faq" className="py-20 bg-[#F8FAFC]">
        <div 
          id={showPrintFaqModal ? "faq-landing-container" : "faq-printable-area"}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-8">
            <span className="text-xs font-extrabold text-[#00C2CB] uppercase tracking-widest block mb-2">
              Tanya Jawab
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0A192F] tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
              Informasi penting seputar layanan sedot WC, limbah STP, dan kepatuhan legalitas di Bekasi.
            </p>

            {/* Small 'Estimated Reading Time' Badge */}
            <div className="mt-3.5 flex items-center justify-center">
              <div 
                id="faq-estimated-reading-time-badge"
                data-testid="estimated-reading-time-badge"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-900 border border-sky-200 shadow-2xs transition-all hover:bg-sky-100/80"
                title={`Estimated Reading Time: ~${faqReadingTime.minutes} menit (dihitung dari total ${faqReadingTime.totalWords} kata dalam ${filteredFaqs.length} FAQ yang sedang ditampilkan)`}
              >
                <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="font-semibold text-slate-700">Estimated Reading Time:</span>
                <span className="font-extrabold text-sky-950">
                  ~{faqReadingTime.minutes} {faqReadingTime.minutes === 1 ? 'min' : 'mins'}
                </span>
                <span className="text-sky-600/70 font-normal text-[11px]">
                  ({faqReadingTime.totalWords} words)
                </span>
              </div>
            </div>
            
            {/* Header Action: Print FAQ Button, Export to CSV Button & Social Media Broadcast Icons */}
            <div className="mt-6 flex flex-col items-center justify-center gap-3.5">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  id="print-faq-btn"
                  onClick={() => setShowPrintFaqModal(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0A192F] text-xs sm:text-sm font-bold border-2 border-slate-200 hover:border-[#00C2CB] shadow-xs transition-all cursor-pointer group hover:shadow-md active:scale-98"
                  title="Buka pratinjau ramah cetak (A4 / PDF) untuk referensi profesional"
                  aria-label="Print FAQ"
                >
                  <Printer className="w-4 h-4 text-[#00C2CB] group-hover:scale-110 transition-transform" />
                  <span>Print FAQ</span>
                  <span className="bg-[#00C2CB]/15 text-[#0A192F] font-black text-[11px] px-2 py-0.5 rounded-full">
                    {sortedFaqs.length} Q&A
                  </span>
                </button>

                {/* Export to CSV Button */}
                <button
                  type="button"
                  id="faq-export-csv-btn"
                  onClick={() => exportFaqsToCsv(sortedFaqs, {
                    activeCategory: faqCategoryFilter,
                    searchQuery: faqSearchQuery
                  })}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs sm:text-sm font-bold border-2 border-slate-200 hover:border-emerald-500 shadow-xs transition-all cursor-pointer group hover:shadow-md active:scale-98"
                  title="Unduh seluruh data FAQ yang sedang difilter sebagai file tabel CSV terstruktur"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Export to CSV</span>
                  <span className="bg-emerald-100 text-emerald-800 font-black text-[11px] px-2 py-0.5 rounded-full">
                    CSV ({sortedFaqs.length})
                  </span>
                </button>
              </div>

              {/* Social Media Sharing Icons (WhatsApp, Facebook, Twitter) */}
              <div className="w-full max-w-xl">
                <div className="bg-white/80 backdrop-blur-xs py-2 px-3 sm:px-4 rounded-2xl border border-slate-200 shadow-2xs">
                  <FaqSocialShare 
                    filteredCount={filteredFaqs.length}
                    totalCount={FAQS.length}
                    activeCategory={faqCategoryFilter}
                    searchQuery={faqSearchQuery}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Input Pencarian FAQ & Filter Kategori */}
          <div className="mb-8 space-y-3.5">
            {/* Search Input Box */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-[#00C2CB] absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={faqSearchQuery}
                  onKeyDown={() => {
                    playFaqClickSound();
                  }}
                  onChange={(e) => {
                    playFaqClickSound();
                    const val = e.target.value;
                    setFaqSearchQuery(val);
                    if (val.trim().length > 1 && !activeFaq) {
                      // Buka otomatis hasil pertama bila relevan
                      const firstMatch = FAQS.find(
                        item => item.q.toLowerCase().includes(val.toLowerCase()) || 
                                item.a.toLowerCase().includes(val.toLowerCase())
                      );
                      if (firstMatch) {
                        setActiveFaq(firstMatch.q);
                      }
                    }
                  }}
                  placeholder="Cari pertanyaan... (contoh: tips perawatan, harga, garansi, septic tank mampet, APD, IPLT)"
                  className={`w-full pl-12 ${
                    faqSearchQuery ? 'pr-24' : 'pr-14'
                  } py-3.5 rounded-2xl bg-white border-2 text-sm text-[#0A192F] placeholder-slate-400 focus:outline-none focus:border-[#00C2CB] focus:ring-4 focus:ring-[#00C2CB]/15 shadow-sm transition-all ${
                    landingVoiceSearch.isListening ? 'border-rose-400 ring-4 ring-rose-200' : 'border-slate-200'
                  }`}
                  aria-label="Cari pertanyaan FAQ"
                />
                <div className="absolute right-3.5 flex items-center gap-1.5">
                  {faqSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        playFaqClickSound();
                        setFaqSearchQuery('');
                        landingVoiceSearch.resetTranscript();
                      }}
                      className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      title="Hapus pencarian"
                      aria-label="Hapus kata kunci pencarian"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <FaqVoiceSearchButton
                    id="faq-voice-search-btn"
                    isListening={landingVoiceSearch.isListening}
                    isSupported={landingVoiceSearch.isSupported}
                    onToggle={landingVoiceSearch.toggleListening}
                  />
                </div>
              </div>

              {/* Real-time Voice Search Status & Transcription Feedback */}
              {landingVoiceSearch.isListening && (
                <div className="mt-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 px-3.5 py-2 rounded-xl flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-semibold">Mendengarkan... Silakan ucapkan pertanyaan Anda (contoh: "biaya sedot wc", "garansi", "septic tank penuh")</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => landingVoiceSearch.stopListening()}
                    className="text-rose-600 hover:text-rose-800 font-bold text-xs underline ml-2 cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              )}
              {landingVoiceSearch.errorMessage && (
                <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl flex items-center justify-between">
                  <span>{landingVoiceSearch.errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => landingVoiceSearch.resetTranscript()}
                    className="text-amber-700 hover:text-amber-900 font-bold text-xs underline ml-2 cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto">
              {[
                { label: 'Semua', filter: 'Semua', icon: Layers },
                { label: 'Tips Perawatan', filter: 'Tips Perawatan', icon: Sparkles, iconColor: 'text-emerald-500' },
                { label: 'Harga & Biaya', filter: 'Harga & Biaya', icon: Receipt, iconColor: 'text-amber-500' },
                { label: 'Jaminan Garansi', filter: 'Jaminan Garansi', icon: Award, iconColor: 'text-orange-500' },
                { label: 'SOP APD & Keamanan', filter: 'SOP Keamanan (APD)', icon: ShieldCheck, iconColor: 'text-emerald-600' },
                { label: 'Cakupan Wilayah', filter: 'Cakupan Wilayah', icon: MapPin, iconColor: 'text-cyan-600' },
                { label: 'Manifest & IPLT', filter: 'Legalitas & IPLT', icon: FileCheck, iconColor: 'text-teal-600' }
              ].map((cat, idx) => {
                const Icon = cat.icon;
                const isActive = faqCategoryFilter === cat.filter;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      playFaqClickSound();
                      setFaqCategoryFilter(cat.filter);
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0A192F] text-white shadow-sm ring-2 ring-[#00C2CB]'
                        : 'bg-white text-slate-600 hover:text-[#0A192F] hover:bg-slate-100 border border-slate-200 shadow-2xs'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#00C2CB]' : cat.iconColor || 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Visual Legend Key Explaining What Each Category Icon Represents */}
            <div 
              id="faq-category-legend-key"
              data-testid="faq-category-legend-key"
              className="mt-3.5 max-w-3xl mx-auto bg-white/95 backdrop-blur-xs rounded-2xl border border-slate-200/90 p-3 sm:p-4 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Info className="w-3.5 h-3.5 text-[#00C2CB] shrink-0" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#0A192F]">
                    Panduan Ikon Kategori Informasi (Visual Legend Key)
                  </span>
                </div>
                <span className="text-[10.5px] text-slate-400 font-medium hidden sm:inline">
                  Pilih salah satu ikon untuk menyaring FAQ
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                {[
                  {
                    id: 'harga',
                    title: 'Harga & Biaya',
                    filter: 'Harga & Biaya',
                    icon: Receipt,
                    desc: 'Tarif /m³, kalkulator biaya & simulasi manifest',
                    iconBg: 'bg-amber-500/15',
                    iconColor: 'text-amber-600',
                    iconBorder: 'border-amber-300/60',
                    activeRing: 'ring-amber-400/50',
                    activeBorder: 'border-amber-400',
                    activeBg: 'bg-amber-50/70'
                  },
                  {
                    id: 'garansi',
                    title: 'Jaminan Garansi',
                    filter: 'Jaminan Garansi',
                    icon: Award,
                    desc: 'Garansi pengerjaan tuntas & komitmen mutu teknisi',
                    iconBg: 'bg-orange-500/15',
                    iconColor: 'text-orange-600',
                    iconBorder: 'border-orange-300/60',
                    activeRing: 'ring-orange-400/50',
                    activeBorder: 'border-orange-400',
                    activeBg: 'bg-orange-50/70'
                  },
                  {
                    id: 'tips',
                    title: 'Tips Perawatan',
                    filter: 'Tips Perawatan',
                    icon: Sparkles,
                    desc: 'Jadwal sedot rutin & cara cegah saluran mampet',
                    iconBg: 'bg-emerald-500/15',
                    iconColor: 'text-emerald-600',
                    iconBorder: 'border-emerald-300/60',
                    activeRing: 'ring-emerald-400/50',
                    activeBorder: 'border-emerald-400',
                    activeBg: 'bg-emerald-50/70'
                  },
                  {
                    id: 'keamanan',
                    title: 'SOP Keamanan',
                    filter: 'SOP Keamanan (APD)',
                    icon: ShieldCheck,
                    desc: 'Protokol K3, APD lengkap & standar higienis',
                    iconBg: 'bg-emerald-500/15',
                    iconColor: 'text-emerald-700',
                    iconBorder: 'border-emerald-300/60',
                    activeRing: 'ring-emerald-400/50',
                    activeBorder: 'border-emerald-400',
                    activeBg: 'bg-emerald-50/70'
                  },
                  {
                    id: 'wilayah',
                    title: 'Cakupan Wilayah',
                    filter: 'Cakupan Wilayah',
                    icon: MapPin,
                    desc: 'Jangkauan armada di 23 kecamatan Kota & Kab. Bekasi',
                    iconBg: 'bg-cyan-500/15',
                    iconColor: 'text-cyan-600',
                    iconBorder: 'border-cyan-300/60',
                    activeRing: 'ring-cyan-400/50',
                    activeBorder: 'border-cyan-400',
                    activeBg: 'bg-cyan-50/70'
                  },
                  {
                    id: 'legalitas',
                    title: 'Legalitas & IPLT',
                    filter: 'Legalitas & IPLT',
                    icon: FileCheck,
                    desc: 'Manifest resmi IPLT Sumur Batu, NIB & faktur pajak',
                    iconBg: 'bg-teal-500/15',
                    iconColor: 'text-teal-600',
                    iconBorder: 'border-teal-300/60',
                    activeRing: 'ring-teal-400/50',
                    activeBorder: 'border-teal-400',
                    activeBg: 'bg-teal-50/70'
                  }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = faqCategoryFilter === item.filter;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        playFaqClickSound();
                        setFaqCategoryFilter(isSelected ? 'Semua' : item.filter);
                      }}
                      className={`group/legend flex flex-col p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? `${item.activeBg} ${item.activeBorder} ring-2 ${item.activeRing} shadow-2xs`
                          : 'bg-slate-50/80 hover:bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs'
                      }`}
                      title={`Klik untuk menyaring pertanyaan kategori ${item.title}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md ${item.iconBg} ${item.iconColor} border ${item.iconBorder} shrink-0 group-hover/legend:scale-110 transition-transform`}>
                          <Icon className="w-3 h-3" />
                        </span>
                        <span className={`text-[11px] font-extrabold truncate ${isSelected ? 'text-[#0A192F]' : 'text-slate-800'}`}>
                          {item.title}
                        </span>
                      </div>
                      <p className="text-[9.5px] text-slate-500 leading-tight">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* FAQ Toolbar: Sorting Dropdown & Results Counter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 max-w-3xl mx-auto px-2 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span>Menampilkan</span>
                <strong className="text-[#0A192F] font-black bg-slate-200/70 px-1.5 py-0.5 rounded">
                  {sortedFaqs.length}
                </strong>
                <span>dari {FAQS.length} pertanyaan</span>
                {faqSearchQuery && (
                  <span className="text-slate-600">
                    untuk "<strong>{faqSearchQuery}</strong>"
                  </span>
                )}
                {faqCategoryFilter !== 'Semua' && (
                  <span className="text-[#00C2CB] font-bold">
                    • Kategori: {faqCategoryFilter}
                  </span>
                )}
                {faqSortOrder === 'alphabetical' && (
                  <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 font-bold px-2 py-0.5 rounded-full text-[10.5px]">
                    <span>Sort: A-Z</span>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 flex-wrap justify-between sm:justify-end">
                {/* Sorting Dropdown */}
                <div className="flex items-center gap-2">
                  <label 
                    htmlFor="faq-sort-dropdown" 
                    className="text-xs font-bold text-slate-600 flex items-center gap-1.5 cursor-pointer"
                    title="Urutkan pertanyaan FAQ"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-[#00C2CB]" />
                    <span>Urutkan:</span>
                  </label>
                  <div className="relative">
                    <select
                      id="faq-sort-dropdown"
                      data-testid="faq-sort-dropdown"
                      value={faqSortOrder}
                      onChange={(e) => {
                        playFaqClickSound();
                        setFaqSortOrder(e.target.value as 'recent' | 'alphabetical');
                      }}
                      className="text-xs font-bold text-[#0A192F] bg-white border-2 border-slate-200 hover:border-[#00C2CB] rounded-xl pl-3 pr-8 py-1.5 focus:outline-none focus:border-[#00C2CB] focus:ring-2 focus:ring-[#00C2CB]/20 transition-all cursor-pointer shadow-2xs appearance-none"
                      aria-label="Urutkan pertanyaan FAQ"
                    >
                      <option value="recent">Recent</option>
                      <option value="alphabetical">Alphabetical (A-Z)</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowPrintFaqModal(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#00C2CB] bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
                    title="Cetak daftar FAQ yang sedang difilter"
                  >
                    <Printer className="w-3.5 h-3.5 text-[#00C2CB]" />
                    <span className="hidden sm:inline">Print FAQ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => exportFaqsToCsv(sortedFaqs, {
                      activeCategory: faqCategoryFilter,
                      searchQuery: faqSearchQuery
                    })}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-white px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-300 transition-all cursor-pointer"
                    title="Unduh daftar FAQ sebagai CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CSV</span>
                  </button>

                  {(faqSearchQuery.trim() || faqCategoryFilter !== 'Semua' || faqSortOrder !== 'recent') && (
                    <button
                      type="button"
                      onClick={() => {
                        playFaqClickSound();
                        setFaqSearchQuery('');
                        setFaqCategoryFilter('Semua');
                        setFaqSortOrder('recent');
                      }}
                      className="text-xs font-bold text-[#FF6B00] hover:text-[#E65F00] hover:underline cursor-pointer shrink-0 ml-1"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* HIGH-CONTRAST COMPLIANCE NOTICE BLOCK FOR COMMERCIAL CLIENTS */}
          <div 
            id="faq-compliance-notice"
            className="mb-8 p-5 sm:p-6 rounded-3xl bg-[#0A192F] text-white border-2 border-emerald-400 shadow-xl relative overflow-hidden"
          >
            {/* Ambient accent background glows */}
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#00C2CB]/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/80 flex items-center justify-center shrink-0 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-black tracking-widest uppercase text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30">
                      COMPLIANCE NOTICE • KEPATUHAN LINGKUNGAN
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                      STANDAR PERDA BEKASI
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                    Jaminan Kepatuhan Regulasi Lingkungan Hidup & Standar Pembuangan Limbah
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                    Seluruh penanganan limbah tinja, lumpur septic tank, dan STP komersial yang dilaksanakan oleh <strong>PT Kusuma Gemilang Raya</strong> mematuhi <strong>Peraturan Daerah (Perda) Kota & Kabupaten Bekasi</strong> serta baku mutu lingkungan hidup. Seluruh hasil sedot dibuang secara resmi ke <strong>IPLT Sumur Batu</strong> dan diverifikasi dengan dokumen <em>Berita Acara Manifest Pembuangan Resmi</em> untuk audit ISO / AMDAL klien komersial & industri.
                  </p>

                  <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
                    <span className="inline-flex items-center gap-1.5 text-emerald-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      100% Legal IPLT Sumur Batu
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-amber-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                      Manifest & Dokumen Limbah Sah
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-cyan-300 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                      NIB KBLI 37011 Berizin
                    </span>
                  </div>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto flex md:flex-col items-center justify-between gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-slate-700 md:pl-5">
                <button
                  type="button"
                  onClick={() => setShowPrintFaqModal(true)}
                  className="w-full md:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0A192F] font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Unduh Dokumen Legal</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono text-center block">
                  REF: REG-PERDA-2026
                </span>
              </div>
            </div>
          </div>

          {/* FAQ Accordion List or Empty State */}
          {sortedFaqs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0A192F] mb-1.5">
                Tidak ada pertanyaan yang sesuai
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
                Tidak ditemukan FAQ untuk pencarian{' '}
                <strong className="text-slate-700 font-bold">"{faqSearchQuery}"</strong>
                {faqCategoryFilter !== 'Semua' && ` pada kategori "${faqCategoryFilter}"`}. 
                Silakan coba kata kunci lain atau langsung hubungi tim teknis kami.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFaqSearchQuery('');
                    setFaqCategoryFilter('Semua');
                  }}
                  className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Lihat Semua Pertanyaan ({FAQS.length})
                </button>
                <a
                  href={getOptimizedWhatsAppUrl(
                    generateIntelligentWaTemplate({
                      sectionId: 'faq',
                      faqQuestion: faqSearchQuery ? `Pencarian: ${faqSearchQuery}` : 'Tanya Jawab Umum Sanitasi',
                      urgency: 'tanya_biaya'
                    }, deviceInfo.deviceType),
                    deviceInfo.isMobile
                  )}
                  onClick={() => {
                    const faqCtx = {
                      sectionId: 'faq',
                      faqQuestion: faqSearchQuery ? `Pencarian: ${faqSearchQuery}` : 'Tanya Jawab Umum Sanitasi',
                      urgency: 'tanya_biaya' as const
                    };
                    setInteractionContext(faqCtx);
                    updateActiveContext(faqCtx);
                    executeAutoRedirect(faqCtx, 'faq_search_wa_button');
                  }}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-full bg-[#FF6B00] hover:bg-[#E65F00] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Tanyakan Langsung via WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <motion.div 
              key={`faq-stagger-${faqSearchQuery}-${faqCategoryFilter}-${faqSortOrder}`}
              variants={faqStaggerContainerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 print:space-y-4"
            >
              {sortedFaqs.map((faq, idx) => {
                const isOpen = activeFaq === faq.q;
                
                // Dynamic descriptive styling & icon configurations per FAQ type
                const getFaqQuestionIcon = (faqItem: typeof faq) => {
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

                  if (faqItem.highlightType === 'maintenance' || faqItem.category?.includes('Perawatan') || faqItem.iconName === 'Sparkles') {
                    return (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/15 text-emerald-600 border border-emerald-300/60 shadow-2xs shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                        <Sparkles className="w-3.5 h-3.5" />
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

                  if (faqItem.category?.includes('Manifest') || faqItem.iconName === 'FileCheck') {
                    return (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-teal-500/15 text-teal-600 border border-teal-300/60 shadow-2xs shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-all">
                        <FileCheck className="w-3.5 h-3.5" />
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
                    case 'FileCheck':
                      return <FileCheck className={iconClass} />;
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
                    case 'Sparkles':
                      return <Sparkles className={iconClass} />;
                    default:
                      return <ShieldCheck className={iconClass} />;
                  }
                };

                const isPricing = faq.highlightType === 'pricing' || faq.iconName === 'BadgeDollarSign';
                const isGuarantee = faq.highlightType === 'guarantee' || faq.iconName === 'Award';
                const isSafety = faq.highlightType === 'safety' || faq.iconName === 'ShieldCheck';
                const isManifest = faq.category?.includes('Manifest') || faq.iconName === 'FileCheck';
                const isMaintenance = faq.highlightType === 'maintenance' || faq.category === 'Tips Perawatan';
                const faqAnchorId = `faq-${faq.id || (idx + 1)}`;

                return (
                  <motion.div
                    key={faq.id || idx}
                    variants={faqStaggerItemVariants}
                    id={faqAnchorId}
                    className={`bg-white rounded-2xl border transition-all overflow-hidden scroll-mt-28 print:transform-none print:opacity-100 ${
                      isOpen 
                        ? isPricing
                          ? 'border-amber-400 shadow-md ring-2 ring-amber-400/20'
                          : isGuarantee
                            ? 'border-orange-400 shadow-md ring-2 ring-orange-400/20'
                            : isMaintenance
                              ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                              : isSafety
                                ? 'border-emerald-400 shadow-md ring-2 ring-emerald-400/20'
                                : isManifest
                                  ? 'border-teal-400 shadow-md ring-2 ring-teal-400/20'
                                  : 'border-[#00C2CB] shadow-md ring-2 ring-[#00C2CB]/10' 
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-full p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 font-bold text-base text-[#0A192F]">
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.q)}
                        className="flex items-start sm:items-center gap-3.5 flex-1 text-left cursor-pointer hover:text-[#00C2CB] transition-colors group"
                        aria-expanded={isOpen}
                      >
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
                                : isMaintenance
                                  ? isOpen
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-emerald-500/15 text-emerald-700'
                                  : isSafety
                                    ? isOpen
                                      ? 'bg-emerald-600 text-white shadow-sm'
                                      : 'bg-emerald-500/15 text-emerald-700'
                                    : isManifest
                                      ? isOpen
                                        ? 'bg-teal-600 text-white shadow-sm'
                                        : 'bg-teal-500/15 text-teal-700'
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
                                      : isMaintenance
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : isSafety
                                          ? 'bg-emerald-100 text-emerald-800'
                                          : isManifest
                                            ? 'bg-teal-100 text-teal-800'
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
                            {isMaintenance && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>Tips Edukasi</span>
                              </span>
                            )}
                            {isManifest && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                                <FileCheck className="w-2.5 h-2.5" />
                                <span>Resmi IPLT</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-start sm:items-center gap-2">
                            {/* Small dynamic descriptive icon next to question */}
                            {getFaqQuestionIcon(faq)}
                            <span className="block text-sm sm:text-base font-bold leading-snug text-[#0A192F] group-hover:text-[#00C2CB] transition-colors">
                              {highlightFaqMatch(faq.q, faqSearchQuery)}
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Right Action: Share Link button + Chevron toggle */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => handleCopyFaqLink(e, faq, idx)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            copiedFaqId === faqAnchorId
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-400/20 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-[#0A192F] border-slate-200'
                          }`}
                          title={`Salin tautan langsung (#${faqAnchorId})`}
                          aria-label={`Salin tautan pertanyaan: ${faq.q}`}
                        >
                          {copiedFaqId === faqAnchorId ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-[11px] font-bold text-emerald-700">Tersalin!</span>
                            </>
                          ) : (
                            <>
                              <Link2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />
                              <span className="text-[11px] hidden sm:inline">Bagikan</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleFaq(faq.q)}
                          className="p-1 rounded-lg hover:bg-slate-100 text-[#00C2CB] transition-colors cursor-pointer"
                          aria-label={isOpen ? "Tutup pertanyaan" : "Buka pertanyaan"}
                          aria-expanded={isOpen}
                        >
                          <ChevronDown
                            className={`w-5 h-5 text-[#00C2CB] shrink-0 transition-transform duration-300 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-5 pb-6 sm:px-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                        <div className="pt-3.5 pl-0 sm:pl-[49px]">
                          <p>{highlightFaqMatch(faq.a, faqSearchQuery)}</p>
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
                                  ? faq.category === 'Tips Perawatan'
                                    ? 'Panduan Sanitasi & Tips Resmi Terverifikasi Teknisi Ahli'
                                    : 'Standar SOP Keamanan & Higienitas Resmi Terverifikasi'
                                  : faq.category === 'Tips Perawatan'
                                    ? 'Rekomendasi Resmi Pencegahan Mampet PT Kusuma Gemilang Raya'
                                    : 'Jaminan Resmi Bersertifikat & Bergaransi PT Kusuma Gemilang Raya'}
                              </span>
                            </div>
                          )}

                          {/* Direct Anchor & Share Link bar */}
                          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 text-[11px]">Tautan Langsung:</span>
                              <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                                #{faqAnchorId}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleCopyFaqLink(e, faq, idx)}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00C2CB] hover:text-[#0A192F] cursor-pointer"
                            >
                              {copiedFaqId === faqAnchorId ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600">Tautan Berhasil Tersalin!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Salin Tautan Pertanyaan</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          <div className="text-center mt-10">
            <p className="text-sm text-slate-500 mb-3">Punya pertanyaan lain yang belum terjawab?</p>
            <a
              href={getOptimizedWhatsAppUrl(
                generateIntelligentWaTemplate({
                  sectionId: 'faq',
                  faqQuestion: 'Pertanyaan lain seputar layanan sanitasi Bekasi',
                  urgency: 'tanya_biaya'
                }, deviceInfo.deviceType),
                deviceInfo.isMobile
              )}
              onClick={() => {
                const faqCtx = {
                  sectionId: 'faq',
                  faqQuestion: 'Pertanyaan lain seputar layanan sanitasi Bekasi',
                  urgency: 'tanya_biaya' as const
                };
                setInteractionContext(faqCtx);
                updateActiveContext(faqCtx);
                executeAutoRedirect(faqCtx, 'faq_bottom_cs_button');
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00] hover:text-[#E65F00] transition-colors cursor-pointer"
            >
              <span>Chat langsung dengan CS kami via WhatsApp (Pesan Otomatis)</span>
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
              onClick={() => executeAutoRedirect(effectiveContext, 'final_cta_whatsapp')}
              target="_blank"
              rel="noopener noreferrer"
              data-cta-source="final_cta_whatsapp"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#0A192F] hover:bg-white text-white hover:text-[#0A192F] font-black text-lg transition-all shadow-xl hover:scale-105 cursor-pointer"
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
                <li><a href="#klien" className="hover:text-[#00C2CB] transition-colors">Klien Rekanan (15+ Perusahaan)</a></li>
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

      {/* Desktop Floating WhatsApp Action Button (Left Side) */}
      <a
        href={desktopWaUrl}
        onClick={() => executeAutoRedirect(effectiveContext, 'floating_desktop_wa_left')}
        target="_blank"
        rel="noopener noreferrer"
        data-cta-source="floating_desktop_wa_left"
        aria-label="Konsultasi WhatsApp PT Kusuma Gemilang Raya (Pojok Kiri Bawah)"
        className="hidden md:flex fixed bottom-6 left-6 z-50 items-center gap-3 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white shadow-2xl hover:shadow-[0_10px_25px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all wa-pulse group cursor-pointer border border-white/20 select-none"
      >
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 fill-current drop-shadow" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-200"></span>
          </span>
        </div>

        <div className="text-left leading-tight pr-1">
          <span className="block text-xs font-black tracking-wide uppercase drop-shadow-sm">Chat WhatsApp</span>
          <span className="block text-[10px] text-emerald-100 font-medium">CS Siaga • Respon Cepat</span>
        </div>

        {/* Floating Tooltip pointing right */}
        <span className="absolute left-full ml-3 whitespace-nowrap bg-[#0A192F] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden lg:block border border-white/10">
          Chat CS WhatsApp ({effectiveContext.serviceTitle || SECTION_CONTEXTS[activeSection]?.name || 'Online 24 Jam'})
        </span>
      </a>

      {/* Desktop Floating WhatsApp Action Button (Right Side) */}
      <a
        href={desktopWaUrl}
        onClick={() => executeAutoRedirect(effectiveContext, 'floating_desktop_wa')}
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
          Chat WhatsApp ({effectiveContext.serviceTitle || SECTION_CONTEXTS[activeSection]?.name || 'Online 24 Jam'})
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
            <span>Pesan Otomatis ({effectiveContext.serviceTitle ? 'Layanan Terpilih' : SECTION_CONTEXTS[activeSection]?.badge || 'Aktif'})</span>
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
            onClick={() => executeAutoRedirect(effectiveContext, 'mobile_floating_wa')}
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
        onCustomizeTemplate={(srv) => {
          const srvCtx = { sectionId: 'layanan', serviceId: srv.id, serviceTitle: srv.title, urgency: 'hari_ini' as const };
          setInteractionContext(srvCtx);
          updateActiveContext(srvCtx);
          setAutoCountdown(false);
          setShowAutoRedirectModal(true);
        }}
      />

      {/* Auto-Redirect Floating Widget for Desktop */}
      <AutoRedirectFloatingWidget
        device={deviceInfo}
        activeSectionId={activeSection}
        activeContext={effectiveContext}
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
        initialContext={effectiveContext}
        autoStartCountdown={autoCountdown}
      />

      {/* Marketing Analytics Evaluation Modal */}
      <MarketingAnalyticsModal
        isOpen={showMarketingModal}
        onClose={() => setShowMarketingModal(false)}
      />

      {/* Print FAQ Professional Reference Document Modal */}
      <PrintFaqModal
        isOpen={showPrintFaqModal}
        onClose={() => setShowPrintFaqModal(false)}
        faqs={sortedFaqs}
        activeCategory={faqCategoryFilter}
        searchQuery={faqSearchQuery}
        totalFaqsCount={FAQS.length}
      />
    </div>
  );
}
