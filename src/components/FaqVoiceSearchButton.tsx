import React from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface FaqVoiceSearchButtonProps {
  id?: string;
  isListening: boolean;
  isSupported: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
  title?: string;
}

export const FaqVoiceSearchButton: React.FC<FaqVoiceSearchButtonProps> = ({
  id = 'faq-voice-search-btn',
  isListening,
  isSupported,
  onToggle,
  size = 'md',
  title,
}) => {
  const isSmall = size === 'sm';
  const iconSize = isSmall ? 'w-3.5 h-3.5' : 'w-4 h-4';

  const defaultTitle = isListening
    ? 'Sedang mendengarkan... Bicara pertanyaan Anda sekarang (Klik untuk berhenti)'
    : isSupported
    ? 'Cari dengan Suara (Voice Search via Web Speech API)'
    : 'Fitur pencarian suara (Web Speech API) didukung di Google Chrome / Edge / Safari';

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        id={id}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`relative inline-flex items-center justify-center transition-all cursor-pointer rounded-xl select-none ${
          isSmall ? 'p-1' : 'p-1.5'
        } ${
          isListening
            ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 ring-2 sm:ring-4 ring-rose-400/40 animate-pulse'
            : 'text-slate-400 hover:text-[#00C2CB] hover:bg-slate-100 active:scale-95'
        }`}
        title={title || defaultTitle}
        aria-label={isListening ? 'Voice search aktif dan mendengarkan. Klik untuk berhenti.' : 'Aktifkan pencarian suara'}
        aria-pressed={isListening}
      >
        {/* Animated Soundwave Ripple when actively listening */}
        {isListening && (
          <span className="absolute -inset-1 rounded-xl bg-rose-400/30 animate-ping pointer-events-none" />
        )}

        {isListening ? (
          <div className="relative flex items-center justify-center">
            <Mic className={`${iconSize} text-white animate-bounce`} />
          </div>
        ) : !isSupported ? (
          <MicOff className={`${iconSize} text-slate-300`} />
        ) : (
          <Mic className={`${iconSize} transition-transform hover:scale-110`} />
        )}
      </button>

      {/* Floating active soundwave listening indicator bubble */}
      {isListening && (
        <div
          role="status"
          aria-live="polite"
          className={`absolute z-30 bottom-full mb-2 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 text-white text-[10.5px] font-bold shadow-lg shadow-black/20 whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none border border-rose-500/40`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
          </span>
          <Volume2 className="w-3 h-3 text-rose-400 animate-pulse" />
          <span>Mendengarkan suara...</span>
        </div>
      )}
    </div>
  );
};
