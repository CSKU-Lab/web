import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  type AppSettings,
} from "~/globalStore/settings";

const GLITCH_CLASS = "fail-glitch";
/** Keep in sync with the longest `.fail-glitch` animation in globals.css. */
const GLITCH_DURATION_MS = 700;

let glitchTimer: ReturnType<typeof setTimeout> | null = null;

/** Read glitch toggle straight from storage (plain fn, no React context). */
function glitchEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS.easterEggs.glitch;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return parsed.easterEggs?.glitch ?? DEFAULT_SETTINGS.easterEggs.glitch;
  } catch {
    return DEFAULT_SETTINGS.easterEggs.glitch;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Brief "the page broke" screen glitch — RGB split, jitter, and scanlines —
 * fired when a student fails a material. The render appears to corrupt for
 * ~700ms then recovers. The counterpart to {@link firePassConfetti}.
 *
 * Toggles a class on `<html>` and removes it when the animation ends.
 * No-op during SSR, when the easter egg is off, or when the OS asks for
 * reduced motion. Safe to call repeatedly: a running glitch restarts cleanly.
 */
export function fireFailGlitch() {
  if (typeof window === "undefined") return;
  if (!glitchEnabled()) return;
  if (prefersReducedMotion()) return;

  const root = document.documentElement;

  // Restart cleanly if a glitch is already mid-flight.
  if (glitchTimer !== null) {
    clearTimeout(glitchTimer);
    root.classList.remove(GLITCH_CLASS);
    // Force reflow so the CSS animation re-triggers from frame 0.
    void root.offsetWidth;
  }

  root.classList.add(GLITCH_CLASS);
  glitchTimer = setTimeout(() => {
    root.classList.remove(GLITCH_CLASS);
    glitchTimer = null;
  }, GLITCH_DURATION_MS);
}
