import confetti from "canvas-confetti";
import {
  DEFAULT_SETTINGS,
  SETTINGS_KEY,
  type AppSettings,
} from "~/globalStore/settings";

/** Read confetti toggle straight from storage (plain fn, no React context). */
function confettiEnabled(): boolean {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS.easterEggs.confetti;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return parsed.easterEggs?.confetti ?? DEFAULT_SETTINGS.easterEggs.confetti;
  } catch {
    return DEFAULT_SETTINGS.easterEggs.confetti;
  }
}

function prefersReducedMotion(): boolean {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Celebratory confetti burst, fired when a student passes a material.
 * Two angled cannons from the bottom corners so it reads as a "win".
 * No-op during SSR, when the easter egg is off, or when the OS asks for
 * reduced motion.
 */
export function firePassConfetti() {
  if (typeof window === "undefined") return;
  if (!confettiEnabled()) return;
  if (prefersReducedMotion()) return;

  const defaults = {
    spread: 60,
    startVelocity: 45,
    ticks: 200,
    zIndex: 9999,
    colors: ["#22c55e", "#16a34a", "#4ade80", "#facc15", "#38bdf8"],
  };

  confetti({
    ...defaults,
    particleCount: 80,
    angle: 60,
    origin: { x: 0, y: 0.9 },
  });
  confetti({
    ...defaults,
    particleCount: 80,
    angle: 120,
    origin: { x: 1, y: 0.9 },
  });
}

/**
 * Over-the-top confetti storm for the Konami code easter egg.
 * Ignores the pass-confetti toggle (it has its own toggle) but still
 * respects reduced-motion. No-op during SSR.
 */
export function fireKonamiConfetti() {
  if (typeof window === "undefined") return;
  if (prefersReducedMotion()) return;

  const end = Date.now() + 1500;
  const colors = ["#a855f7", "#ec4899", "#f97316", "#facc15", "#38bdf8"];

  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      startVelocity: 55,
      origin: { x: 0, y: 0.95 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      startVelocity: 55,
      origin: { x: 1, y: 0.95 },
      colors,
      zIndex: 9999,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };

  frame();
}
