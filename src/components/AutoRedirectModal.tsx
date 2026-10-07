import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  Monitor, 
  Send, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  ExternalLink,
  Pause,
  Play
} from 'lucide-react';
import { 
  detectDevice, 
  DeviceInfo, 
  generatePersonalizedWaMessage, 
  getOptimizedWhatsAppUrl, 
  SECTION_CONTEXTS,
  executeAutoRedirect 
} from '../utils/whatsappRedirect';
import { CONTACT_INFO } from '../data/websiteData';

interface AutoRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSectionId: string;
  initialCountdownSeconds?: number;
  autoStartCountdown?: boolean;
}

export default function AutoRedirectModal({
  isOpen,
  onClose,
  activeSectionId,
  initialCountdownSeconds = 3,
  autoStartCountdown = false
}: AutoRedirectModalProps) {
  const [device, setDevice] = useState<DeviceInfo>(detectDevice());
  const [selectedSection, setSelectedSection] = useState<string>(activeSectionId);
  const [countdown, setCountdown] = useState<number>(initialCountdownSeconds);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(autoStartCountdown);
  const [copied, setCopied] = useState<boolean>(false);
  
  const timerRef = useRef<any>(null);

  useEffect(() => {
    setDevice(detectDevice());
  }, [isOpen]);

  useEffect(() => {
    setSelectedSection(activeSectionId);
  }, [activeSectionId]);

  useEffect(() => {
    if (isOpen && autoStartCountdown) {
      setCountdown(initialCountdownSeconds);
      setIsCountingDown(true);
    } else {
      setIsCountingDown(false);
      setCountdown(initialCountdownSeconds);
    }
  }, [isOpen, autoStartCountdown, initialCountdownSeconds]);

  // Handle countdown timer
  useEffect(() => {
    if (!isOpen || !isCountingDown) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isCountingDown, selectedSection]);

  if (!isOpen) return null;

  const currentMessage = generatePersonalizedWaMessage(selectedSection, device.deviceType);
  const optimizedUrl = getOptimizedWhatsAppUrl(currentMessage, device.isMobile);

  const handleRedirect = () => {
    setIsCountingDown(false);
    executeAutoRedirect(selectedSection, 'auto_redirect_modal_action', true);
    onClose();
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(currentMessage).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const progressPercent = ((initialCountdownSeconds - countdown) / initialCountdownSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-[#0A192F] text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#00C2CB] text-[#0A192F]">
              <Sparkles className="w-3.5 h-3.5" />
              Auto-Redirect Cerdas
            </span>
            <span className="text-xs text-slate-300 font-semibold hidden sm:inline">
              WhatsApp Personalization Engine
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
            Menghubungkan ke WhatsApp Admin
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Mendeteksi perangkat & menyesuaikan pesan secara otomatis berdasarkan halaman yang Anda buka.
          </p>

          {/* Countdown Indicator (if active) */}
          {isCountingDown && (
            <div className="mt-4 bg-white/10 rounded-2xl p-3 border border-white/20 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-emerald-300">
                  <Clock className="w-4 h-4 animate-spin text-[#00C2CB]" />
                  Mengalihkan otomatis dalam {countdown} detik...
                </span>
                <button
                  onClick={() => setIsCountingDown(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Pause className="w-3 h-3" />
                  Jeda
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#00C2CB] h-full transition-all duration-1000 ease-linear rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Status Badges: Device & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Device Detection Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E0F7F9] text-[#00C2CB] flex items-center justify-center shrink-0">
                {device.isMobile ? (
                  <Smartphone className="w-5 h-5" />
                ) : (
                  <Monitor className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Jenis Perangkat Terdeteksi
                </span>
                <strong className="text-xs sm:text-sm font-extrabold text-[#0A192F] block">
                  {device.deviceLabel}
                </strong>
                <span className="text-[11px] text-slate-500 block">
                  {device.isMobile ? 'Optimal untuk WhatsApp App Langsung' : 'Optimal untuk WhatsApp Web / Desktop'}
                </span>
              </div>
            </div>

            {/* Current Active Section Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF6B00] flex items-center justify-center shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Halaman / Topik Terbuka
                </span>
                <strong className="text-xs sm:text-sm font-extrabold text-[#0A192F] truncate block">
                  {SECTION_CONTEXTS[selectedSection]?.name || 'Beranda Utama'}
                </strong>
                <span className="text-[11px] text-[#00C2CB] font-bold block">
                  {SECTION_CONTEXTS[selectedSection]?.badge || 'Layanan 24 Jam'}
                </span>
              </div>
            </div>
          </div>

          {/* Selector to switch section manually if desired */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Sesuaikan Topik Konsultasi (Opsi):
            </label>
            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setIsCountingDown(false);
              }}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-[#0A192F] focus:outline-none focus:ring-2 focus:ring-[#00C2CB]"
            >
              {Object.values(SECTION_CONTEXTS).map((ctx) => (
                <option key={ctx.id} value={ctx.id}>
                  {ctx.name} ({ctx.badge})
                </option>
              ))}
            </select>
          </div>

          {/* Generated Message Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Preview Pesan WhatsApp Otomatis:
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] font-bold text-slate-500 hover:text-[#00C2CB] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>

            <div className="bg-[#E7F3E8]/50 border border-emerald-200 rounded-2xl p-4 text-xs sm:text-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner">
              {currentMessage}
            </div>
            
            <p className="text-[11px] text-slate-500 italic">
              💡 Pesan di atas otomatis terisi di kolom chat WhatsApp Anda tanpa perlu mengetik manual.
            </p>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="bg-slate-50 p-4 sm:p-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            <span>Nomor Admin: </span>
            <strong className="text-[#0A192F] font-bold">{CONTACT_INFO.phoneDisplay}</strong>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-3 rounded-full border border-slate-300 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal / Tutup
            </button>

            <a
              href={optimizedUrl}
              onClick={() => {
                executeAutoRedirect(selectedSection, 'auto_redirect_modal_btn');
                onClose();
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 fill-current" />
              <span>Buka WhatsApp Sekarang</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
