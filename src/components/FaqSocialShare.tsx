import React, { useState } from 'react';
import { Share2, Link2, Check, Sparkles } from 'lucide-react';

interface FaqSocialShareProps {
  filteredCount?: number;
  totalCount?: number;
  activeCategory?: string;
  searchQuery?: string;
}

export const FaqSocialShare: React.FC<FaqSocialShareProps> = ({
  filteredCount = 8,
  totalCount = 8,
  activeCategory = 'Semua',
  searchQuery = ''
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  // Dapatkan URL dasar halaman saat ini untuk deep link ke bagian #faq
  const getFaqUrl = (): string => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      return `${origin}${pathname}#faq`;
    }
    return 'https://sedotwcbekasi.co.id/#faq';
  };

  const currentFaqUrl = getFaqUrl();

  // Pesan WhatsApp broadcast yang kaya informasi dan persuasif
  const getWhatsAppMessage = (): string => {
    let msg = `*PUSAT TANYA JAWAB (FAQ) RESMI SEDOT WC BEKASI*\n`;
    msg += `_PT Kusuma Gemilang Raya - Solusi Sanitasi & Limbah Legal IPLT Sumur Batu_\n\n`;
    msg += `Halo Rekan-rekan! Jika Anda sedang mencari informasi resmi seputar:\n`;
    msg += `• Biaya & transparansi tarif sedot septic tank tanpa biaya siluman\n`;
    msg += `• Garansi pengerjaan 30 hari & standar K3 teknisi bersertifikat\n`;
    msg += `• Legalitas pembuangan resmi ke IPLT Sumur Batu (bebas buang liar)\n`;
    msg += `• Tips darurat mengatasi toilet mampet & bau di perumahan / industri\n\n`;
    
    if (activeCategory && activeCategory !== 'Semua') {
      msg += `Topik Terpilih: *Kategori ${activeCategory}* (${filteredCount} Q&A)\n\n`;
    }

    msg += `Silakan baca tanya jawab lengkap & resmi di link berikut:\n${currentFaqUrl}\n\n`;
    msg += `_Layanan Darurat 24 Jam Hotline: 0812-9988-7766_`;
    return encodeURIComponent(msg);
  };

  // Teks untuk Facebook Sharer
  const getFacebookQuote = (): string => {
    return encodeURIComponent(
      `Pusat Tanya Jawab (FAQ) Resmi Sedot WC Bekasi - PT Kusuma Gemilang Raya. Informasi lengkap tarif, garansi 30 hari, dan legalitas pembuangan resmi IPLT Sumur Batu.`
    );
  };

  // Teks untuk Twitter / X
  const getTwitterText = (): string => {
    let text = `Pusat Informasi & Tanya Jawab (FAQ) Resmi Sedot WC Bekasi oleh PT Kusuma Gemilang Raya. Cek transparansi biaya, garansi 30 hari & legalitas IPLT:`;
    if (activeCategory && activeCategory !== 'Semua') {
      text = `[FAQ: ${activeCategory}] Tanya Jawab Resmi Sedot WC Bekasi PT Kusuma Gemilang Raya:`;
    }
    return encodeURIComponent(text);
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${getWhatsAppMessage()}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentFaqUrl)}&quote=${getFacebookQuote()}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${getTwitterText()}&url=${encodeURIComponent(currentFaqUrl)}&hashtags=SedotWCBekasi,SanitasiBekasi,PTKusumaGemilangRaya`;

  // Salin tautan ke clipboard
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(currentFaqUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = currentFaqUrl;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Gagal menyalin tautan FAQ:', err);
    }
  };

  // Opsi Web Share API bawaan untuk browser mobile (jika didukung)
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'FAQ Resmi Sedot WC Bekasi - PT Kusuma Gemilang Raya',
          text: 'Pusat Tanya Jawab seputar biaya, garansi, legalitas IPLT Sumur Batu, dan layanan sedot WC Bekasi.',
          url: currentFaqUrl
        });
      } catch {
        // User membatalkan share atau tidak support
      }
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1 select-none">
        <Share2 className="w-3.5 h-3.5 text-[#00C2CB]" />
        <span>Bagikan FAQ:</span>
      </span>

      {/* WhatsApp Share Button */}
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan seluruh daftar FAQ ke WhatsApp"
        title="Bagikan ringkasan FAQ lengkap ke WhatsApp (Grup RT/RW / Rekan)"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-emerald-50 hover:bg-[#25D366] text-[#20ba59] hover:text-white border border-emerald-200 hover:border-[#25D366] text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span>WhatsApp</span>
      </a>

      {/* Facebook Share Button */}
      <a
        href={facebookShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan seluruh daftar FAQ ke Facebook"
        title="Bagikan link FAQ ke Facebook"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-blue-50 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-blue-200 hover:border-[#1877F2] text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
      >
        <svg className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span>Facebook</span>
      </a>

      {/* Twitter / X Share Button */}
      <a
        href={twitterShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Bagikan seluruh daftar FAQ ke Twitter / X"
        title="Bagikan link FAQ ke Twitter / X"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white border border-slate-300 hover:border-slate-900 text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 group cursor-pointer"
      >
        <svg className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>Twitter / X</span>
      </a>

      {/* Salin Tautan Cepat */}
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label="Salin tautan seluruh FAQ"
        title="Salin tautan langsung ke bagian FAQ"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 ${
          copied
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
            : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-[#0A192F] border-slate-200 hover:border-slate-400 shadow-xs'
        }`}
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-white" />
            <span className="font-extrabold">Tersalin!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Salin Tautan</span>
          </>
        )}
      </button>

      {/* Native Web Share button (only shown if navigator.share is available on client) */}
      {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
        <button
          type="button"
          onClick={handleNativeShare}
          aria-label="Buka menu berbagi bawaan HP"
          title="Buka menu berbagi aplikasi di perangkat Anda"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-[#00C2CB]/10 hover:bg-[#00C2CB] text-[#0A192F] hover:text-white border border-[#00C2CB]/30 hover:border-[#00C2CB] text-xs font-bold transition-all cursor-pointer active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00C2CB] group-hover:text-white" />
          <span>Lainnya</span>
        </button>
      )}
    </div>
  );
};

export default FaqSocialShare;
