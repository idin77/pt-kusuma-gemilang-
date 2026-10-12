// Utility to calculate estimated reading time based on content length
// Standard average reading speed: 200 words per minute (WPM)

export interface ReadingTimeResult {
  totalWords: number;
  totalChars: number;
  minutes: number;
  seconds: number;
  badgeText: string;
  formattedMinutes: string;
  fullLabel: string;
}

export function calculateFaqReadingTime(
  faqs: Array<{ q?: string; a?: string; question?: string; answer?: string }>
): ReadingTimeResult {
  if (!faqs || faqs.length === 0) {
    return {
      totalWords: 0,
      totalChars: 0,
      minutes: 0,
      seconds: 0,
      badgeText: '0 min',
      formattedMinutes: '0 mnt',
      fullLabel: 'Estimated Reading Time: 0 min'
    };
  }

  let totalWords = 0;
  let totalChars = 0;

  for (const item of faqs) {
    const qText = (item.q || item.question || '').trim();
    const aText = (item.a || item.answer || '').trim();

    // Word count calculation splitting by whitespace
    const qWords = qText ? qText.split(/\s+/).filter(Boolean).length : 0;
    const aWords = aText ? aText.split(/\s+/).filter(Boolean).length : 0;

    totalWords += qWords + aWords;
    totalChars += qText.length + aText.length;
  }

  const wordsPerMinute = 200;
  // Calculate total seconds and round up minutes (minimum 1 minute if content exists)
  const totalSeconds = Math.round((totalWords / wordsPerMinute) * 60);
  const minutes = totalWords === 0 ? 0 : Math.max(1, Math.ceil(totalWords / wordsPerMinute));

  const minLabel = minutes === 1 ? '1 min' : `${minutes} mins`;
  const badgeText = `~${minLabel}`;

  return {
    totalWords,
    totalChars,
    minutes,
    seconds: totalSeconds,
    badgeText,
    formattedMinutes: `~${minutes} mnt`,
    fullLabel: `Estimated Reading Time: ~${minLabel}`
  };
}
