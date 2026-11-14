import { useEffect, useState } from 'react';

/** Parses durations such as "18 min" into seconds. Returns 0 for unrecognised input. */
export function parseMinutes(label: string): number {
  const match = /(\d+(?:\.\d+)?)\s*min/i.exec(label);
  return match ? Math.round(Number(match[1]) * 60) : 0;
}

/** Formats seconds as m:ss, e.g. 1112 -> "18:32". */
export function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Counts down once per second from `startSeconds` to zero.
 * The countdown starts on mount; remount the component (e.g. with a `key`) to restart it.
 */
export function useCountdown(startSeconds: number): number {
  const [remaining, setRemaining] = useState(startSeconds);

  useEffect(() => {
    if (startSeconds <= 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [startSeconds]);

  return remaining;
}
