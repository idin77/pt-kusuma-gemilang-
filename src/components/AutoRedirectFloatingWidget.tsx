import React, { useState } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Sparkles, 
  Send, 
  ChevronRight, 
  Layers, 
  X
} from 'lucide-react';
import { 
  DeviceInfo, 
  SECTION_CONTEXTS,
  generatePersonalizedWaMessage,
  getOptimizedWhatsAppUrl,
  executeAutoRedirect
} from '../utils/whatsappRedirect';

interface AutoRedirectFloatingWidgetProps {
  device: DeviceInfo;
  activeSectionId: string;
  onOpenModal: () => void;
}

export default function AutoRedirectFloatingWidget({
  device,
  activeSectionId,
  onOpenModal
}: AutoRedirectFloatingWidgetProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const context = SECTION_CONTEXTS[activeSectionId] || SECTION_CONTEXTS.beranda;
  const currentMessage = generatePersonalizedWaMessage(activeSectionId, device.deviceType);
  const waUrl = getOptimizedWhatsAppUrl(currentMessage, device.isMobile);

  return (
    <div className="fixed bottom-24 left-6 z-40 hidden md:block animate-fade-in">
      <div className="bg-[#0A192F]/95 backdrop-blur-md text-white rounded-2xl p-3 border border-white/15 shadow-2xl flex items-center gap-3 max-w-md group hover:border-[#00C2CB]/50 transition-all">
        
        {/* Device Icon Indicator */}
        <div 
          onClick={onOpenModal}
          className="w-9 h-9 rounded-xl bg-[#00C2CB]/20 text-[#00C2CB] flex items-center justify-center shrink-0 cursor-pointer hover:bg-[#00C2CB] hover:text-[#0A192F] transition-colors"
          title="Klik untuk melihat detail personalisasi pesan WhatsApp"
        >
          {device.isMobile ? (
            <Smartphone className="w-4 h-4" />
          ) : (
            <Monitor className="w-4 h-4" />
          )}
        </div>

        {/* Text Details */}
        <div className="text-left space-y-0.5 min-w-0 pr-1 cursor-pointer" onClick={onOpenModal}>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#00C2CB]">
              Auto-Redirect Siaga
            </span>
            <span className="text-[10px] text-slate-400">
              ({device.isMobile ? 'Mobile' : 'Desktop'})
            </span>
          </div>

          <p className="text-xs font-bold text-slate-100 truncate flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#FF6B00] shrink-0" />
            <span className="truncate">Topik: {context.name}</span>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-1 shrink-0">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => executeAutoRedirect(activeSectionId, 'floating_widget_direct_wa')}
            className="px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white text-[11px] font-extrabold flex items-center gap-1.5 shadow transition-all cursor-pointer"
            title="Kirim pesan terpersonalisasi langsung ke WhatsApp"
          >
            <Send className="w-3 h-3 fill-current" />
            <span>Chat WA</span>
          </a>

          <button
            type="button"
            onClick={onOpenModal}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Buka opsi preview pesan auto-redirect"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Sembunyikan widget"
            aria-label="Tutup widget"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
}
