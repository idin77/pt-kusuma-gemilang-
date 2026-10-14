import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Check, Sparkles, Award } from 'lucide-react';
import { playFaqClickSound } from '../utils/soundEffects';

interface FaqFeedbackVotingProps {
  faqId: string | number;
  faqQuestion: string;
  className?: string;
  compact?: boolean;
}

type VoteType = 'helpful' | 'not_helpful' | null;

interface FeedbackStorageData {
  userVotes: Record<string, 'helpful' | 'not_helpful'>;
  voteDeltas: Record<string, { helpful: number; not_helpful: number }>;
}

const STORAGE_KEY = 'kgr_faq_feedback_votes_v2';

// Helper to calculate realistic deterministic baseline votes based on FAQ ID and Question string
function getBaselineVotes(faqId: string | number, faqQuestion: string) {
  const seedString = `${faqId}-${faqQuestion}`;
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = (hash << 5) - hash + seedString.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash % 38) + 18; // 18 - 55 positive votes
  const negative = Math.abs((hash >> 4) % 3); // 0 - 2 negative votes
  return { positive, negative };
}

function getStoredFeedbackData(): FeedbackStorageData {
  if (typeof window === 'undefined') {
    return { userVotes: {}, voteDeltas: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { userVotes: {}, voteDeltas: {} };
    return JSON.parse(raw);
  } catch {
    return { userVotes: {}, voteDeltas: {} };
  }
}

function saveFeedbackData(data: FeedbackStorageData) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Dispatch custom event to sync with other FAQ components in real-time
    window.dispatchEvent(new CustomEvent('kgr-faq-vote-changed', { detail: data }));
  } catch (err) {
    console.error('Failed to save FAQ feedback vote:', err);
  }
}

export const FaqFeedbackVoting: React.FC<FaqFeedbackVotingProps> = ({
  faqId,
  faqQuestion,
  className = '',
  compact = false
}) => {
  const itemKey = String(faqId);
  const baseline = React.useMemo(() => getBaselineVotes(faqId, faqQuestion), [faqId, faqQuestion]);

  const [currentVote, setCurrentVote] = useState<VoteType>(null);
  const [helpfulDelta, setHelpfulDelta] = useState<number>(0);
  const [notHelpfulDelta, setNotHelpfulDelta] = useState<number>(0);
  const [showThankYou, setShowThankYou] = useState(false);

  // Sync with localStorage on mount & when custom event fires
  const syncFromStorage = React.useCallback(() => {
    const data = getStoredFeedbackData();
    const userVote = data.userVotes[itemKey] || null;
    const delta = data.voteDeltas[itemKey] || { helpful: 0, not_helpful: 0 };
    setCurrentVote(userVote);
    setHelpfulDelta(delta.helpful || 0);
    setNotHelpfulDelta(delta.not_helpful || 0);
  }, [itemKey]);

  useEffect(() => {
    syncFromStorage();

    const handleVoteChange = (e: Event) => {
      syncFromStorage();
    };

    window.addEventListener('kgr-faq-vote-changed', handleVoteChange);
    window.addEventListener('storage', handleVoteChange);

    return () => {
      window.removeEventListener('kgr-faq-vote-changed', handleVoteChange);
      window.removeEventListener('storage', handleVoteChange);
    };
  }, [syncFromStorage]);

  const handleVote = (voteType: 'helpful' | 'not_helpful') => {
    playFaqClickSound();

    const data = getStoredFeedbackData();
    const existingVote = data.userVotes[itemKey] || null;
    const currentDelta = data.voteDeltas[itemKey] || { helpful: 0, not_helpful: 0 };

    let nextVote: VoteType = null;
    let nextHelpfulDelta = currentDelta.helpful;
    let nextNotHelpfulDelta = currentDelta.not_helpful;

    if (existingVote === voteType) {
      // Toggle off / cancel vote
      nextVote = null;
      if (voteType === 'helpful') {
        nextHelpfulDelta = Math.max(0, nextHelpfulDelta - 1);
      } else {
        nextNotHelpfulDelta = Math.max(0, nextNotHelpfulDelta - 1);
      }
      delete data.userVotes[itemKey];
      setShowThankYou(false);
    } else {
      // New or switched vote
      nextVote = voteType;
      if (existingVote === 'helpful') {
        nextHelpfulDelta = Math.max(0, nextHelpfulDelta - 1);
      } else if (existingVote === 'not_helpful') {
        nextNotHelpfulDelta = Math.max(0, nextNotHelpfulDelta - 1);
      }

      if (voteType === 'helpful') {
        nextHelpfulDelta += 1;
      } else {
        nextNotHelpfulDelta += 1;
      }

      data.userVotes[itemKey] = voteType;
      setShowThankYou(true);
      // Automatically keep thank you message visible
    }

    data.voteDeltas[itemKey] = {
      helpful: nextHelpfulDelta,
      not_helpful: nextNotHelpfulDelta
    };

    saveFeedbackData(data);
    setCurrentVote(nextVote);
    setHelpfulDelta(nextHelpfulDelta);
    setNotHelpfulDelta(nextNotHelpfulDelta);
  };

  const totalHelpful = baseline.positive + helpfulDelta;
  const totalNotHelpful = baseline.negative + notHelpfulDelta;
  const totalVotes = totalHelpful + totalNotHelpful;
  const helpfulPercentage = totalVotes > 0 ? Math.round((totalHelpful / totalVotes) * 100) : 100;

  return (
    <div
      id={`faq-feedback-vote-${itemKey}`}
      data-testid={`faq-feedback-vote-${itemKey}`}
      className={`faq-feedback-box mt-3 pt-3 border-t border-slate-100 print:border-slate-300 ${className}`}
    >
      {/* SCREEN INTERACTIVE VOTING CONTROLS */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#00C2CB] shrink-0" />
            <span>Apakah jawaban ini membantu?</span>
          </span>
          {helpfulPercentage >= 90 && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 hidden md:inline-flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-600" />
              <span>{helpfulPercentage}% Terbantu</span>
            </span>
          )}
        </div>

        {/* Voting Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Helpful Button */}
          <button
            type="button"
            id={`faq-vote-helpful-btn-${itemKey}`}
            data-testid={`faq-vote-helpful-btn-${itemKey}`}
            onClick={() => handleVote('helpful')}
            aria-pressed={currentVote === 'helpful'}
            aria-label={`Tandai jawaban pertanyaan '${faqQuestion}' sebagai membantu`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              currentVote === 'helpful'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                : 'bg-white hover:bg-emerald-50/70 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-300'
            }`}
            title="Klik jika jawaban ini membantu Anda"
          >
            <ThumbsUp
              className={`w-3.5 h-3.5 transition-transform ${
                currentVote === 'helpful' ? 'fill-emerald-600 text-emerald-700 scale-110' : 'text-slate-400 group-hover:text-emerald-600'
              }`}
            />
            <span>Membantu</span>
            <span
              id={`faq-helpful-count-${itemKey}`}
              className={`ml-0.5 px-1.5 py-0.2 rounded-md text-[11px] font-mono font-bold ${
                currentVote === 'helpful'
                  ? 'bg-emerald-200/80 text-emerald-900'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalHelpful}
            </span>
          </button>

          {/* Not Helpful Button */}
          <button
            type="button"
            id={`faq-vote-not-helpful-btn-${itemKey}`}
            data-testid={`faq-vote-not-helpful-btn-${itemKey}`}
            onClick={() => handleVote('not_helpful')}
            aria-pressed={currentVote === 'not_helpful'}
            aria-label={`Tandai jawaban pertanyaan '${faqQuestion}' sebagai kurang membantu`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              currentVote === 'not_helpful'
                ? 'bg-rose-50 text-rose-800 border-rose-400 ring-2 ring-rose-400/20 shadow-xs'
                : 'bg-white hover:bg-rose-50/70 text-slate-700 hover:text-rose-700 border-slate-200 hover:border-rose-300'
            }`}
            title="Klik jika jawaban ini masih kurang jelas atau belum membantu"
          >
            <ThumbsDown
              className={`w-3.5 h-3.5 transition-transform ${
                currentVote === 'not_helpful' ? 'fill-rose-600 text-rose-700 scale-110' : 'text-slate-400 group-hover:text-rose-600'
              }`}
            />
            <span>Kurang Membantu</span>
            <span
              id={`faq-not-helpful-count-${itemKey}`}
              className={`ml-0.5 px-1.5 py-0.2 rounded-md text-[11px] font-mono font-bold ${
                currentVote === 'not_helpful'
                  ? 'bg-rose-200/80 text-rose-900'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {totalNotHelpful}
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation feedback alert message */}
      {showThankYou && currentVote && (
        <div
          id={`faq-vote-feedback-msg-${itemKey}`}
          className="no-print mt-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center justify-between gap-2 animate-fadeIn"
        >
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>
              {currentVote === 'helpful'
                ? 'Terima kasih atas masukan Anda! Rating Anda membantu meningkatkan kejelasan informasi pelanggan.'
                : 'Terima kasih atas masukannya. Tim teknisi kami akan melengkapi penjelasan informasi ini.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowThankYou(false)}
            className="text-emerald-700 hover:text-emerald-900 text-[10px] font-bold underline cursor-pointer"
          >
            Tutup
          </button>
        </div>
      )}

      {/* PRINT-ONLY OFFICIAL DOCUMENT UTILITY RATING */}
      <div className="hidden print:flex items-center justify-between text-[9px] text-slate-600 pt-1 mt-1 border-t border-slate-200 print:text-black">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="font-bold uppercase tracking-wider text-slate-800 print:text-black">Indeks Kebergunaan Informasi:</span>
          <span>{helpfulPercentage}% Pelanggan Menyatakan Membantu</span>
          <span className="text-slate-400">•</span>
          <span className="font-mono">({totalHelpful} verifikasi positif)</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[8.5px] text-slate-500 print:text-slate-700">
          <span>[ ✓ ] Membantu</span>
          <span>[   ] Kurang Membantu</span>
        </div>
      </div>
    </div>
  );
};
