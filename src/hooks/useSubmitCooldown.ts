import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_COOLDOWN_MS = 5000;

export interface SubmitCooldownState {
  /** True while the cooldown window is active. */
  isCoolingDown: boolean;
  /** Whole seconds remaining, rounded up (5, 4, 3, 2, 1). */
  remainingSeconds: number;
  /** Elapsed fraction of the cooldown, 0 at start -> 1 when finished. */
  progress: number;
  /** Begin (or restart) the cooldown window. */
  start: () => void;
}

/**
 * Drives a fixed-duration cooldown for submit buttons. Uses requestAnimationFrame
 * so the progress value updates smoothly for a depleting-bar animation, while
 * `remainingSeconds` gives a coarse countdown for the label.
 */
export function useSubmitCooldown(
  durationMs: number = DEFAULT_COOLDOWN_MS,
): SubmitCooldownState {
  const [endTime, setEndTime] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (endTime === null) return;

    const tick = () => {
      const current = Date.now();
      setNow(current);
      if (current >= endTime) {
        setEndTime(null);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [endTime]);

  const start = useCallback(() => {
    const current = Date.now();
    setNow(current);
    setEndTime(current + durationMs);
  }, [durationMs]);

  const remainingMs = endTime !== null ? Math.max(0, endTime - now) : 0;
  const isCoolingDown = remainingMs > 0;
  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const progress = isCoolingDown ? 1 - remainingMs / durationMs : 1;

  return { isCoolingDown, remainingSeconds, progress, start };
}
