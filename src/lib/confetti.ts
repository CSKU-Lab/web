import confetti from "canvas-confetti";

/**
 * Celebratory confetti burst, fired when a student passes a material.
 * Two angled cannons from the bottom corners so it reads as a "win".
 * No-op during SSR.
 */
export function firePassConfetti() {
  if (typeof window === "undefined") return;

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
