import { useState, useEffect, useRef, useCallback } from 'react';
import { playFaqClickSound } from './soundEffects';

// Extended type definitions for Web Speech API SpeechRecognition
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultItem {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionEventMap {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => any) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => any) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEventMap) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

// Check window support safely in SSR/SPA
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return Boolean(win.SpeechRecognition || win.webkitSpeechRecognition);
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export interface UseVoiceSearchOptions {
  lang?: string;
  onTranscriptChange?: (text: string, isFinal: boolean) => void;
  onFinalTranscript?: (text: string) => void;
  onError?: (errorMessage: string) => void;
}

export interface UseVoiceSearchResult {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  interimTranscript: string;
  errorMessage: string | null;
  startListening: () => void;
  stopListening: () => void;
  toggleListening: () => void;
  resetTranscript: () => void;
}

export function useVoiceSearch({
  lang = 'id-ID',
  onTranscriptChange,
  onFinalTranscript,
  onError,
}: UseVoiceSearchOptions = {}): UseVoiceSearchResult {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);

  // Check support on mount
  useEffect(() => {
    setIsSupported(isSpeechRecognitionSupported());
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, []);

  const stopListening = useCallback(() => {
    isManuallyStoppedRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const startListening = useCallback(() => {
    setErrorMessage(null);
    isManuallyStoppedRef.current = false;

    const SpeechRecClass = getSpeechRecognitionConstructor();
    if (!SpeechRecClass) {
      const msg = 'Browser ini belum mendukung Web Speech API. Silakan gunakan Google Chrome, Edge, atau Safari.';
      setErrorMessage(msg);
      onError?.(msg);
      return;
    }

    try {
      // Abort any existing instance
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }

      const recognition = new SpeechRecClass();
      recognition.lang = lang;
      recognition.continuous = false; // single focused search query
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
        playFaqClickSound();
      };

      recognition.onresult = (event: SpeechRecognitionEventMap) => {
        let currentInterim = '';
        let currentFinal = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const text = item[0]?.transcript || '';
          if (item.isFinal) {
            currentFinal += text;
          } else {
            currentInterim += text;
          }
        }

        const combinedText = (currentFinal || currentInterim).trim();

        if (currentInterim) {
          setInterimTranscript(currentInterim);
          onTranscriptChange?.(currentInterim, false);
        }

        if (currentFinal) {
          const cleanedText = currentFinal.trim();
          setTranscript(cleanedText);
          setInterimTranscript('');
          onTranscriptChange?.(cleanedText, true);
          onFinalTranscript?.(cleanedText);
        } else if (combinedText) {
          onTranscriptChange?.(combinedText, false);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        let userFriendlyError = 'Pencarian suara terhenti.';
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          userFriendlyError = 'Izin mikrofon ditolak. Mohon aktifkan izin mikrofon browser Anda.';
        } else if (event.error === 'no-speech') {
          userFriendlyError = 'Tidak ada suara terdengar. Silakan coba bicara kembali.';
        } else if (event.error === 'audio-capture') {
          userFriendlyError = 'Mikrofon tidak terdeteksi atau sedang digunakan aplikasi lain.';
        } else if (event.error === 'network') {
          userFriendlyError = 'Gagal menghubungkan ke layanan suara jaringan.';
        }

        setErrorMessage(userFriendlyError);
        setIsListening(false);
        setInterimTranscript('');
        onError?.(userFriendlyError);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: unknown) {
      const errStr = err instanceof Error ? err.message : 'Gagal memulai perekaman suara';
      setErrorMessage(errStr);
      setIsListening(false);
      onError?.(errStr);
    }
  }, [lang, onError, onFinalTranscript, onTranscriptChange]);

  const toggleListening = useCallback(() => {
    playFaqClickSound();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setErrorMessage(null);
  }, []);

  return {
    isListening,
    isSupported,
    transcript,
    interimTranscript,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
  };
}
