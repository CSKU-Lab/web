"use client";

import { useEffect, useRef } from "react";
import { fireKonamiConfetti } from "~/lib/confetti";
import { useOpenSettings, useSettingsValue } from "~/globalStore/settings";
import SettingsDialog from "./SettingsDialog";

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

/**
 * Single client-side host mounted once at the app root. Owns the global
 * settings dialog and the keyboard listeners that can't live in the
 * (server) layout: ⌘/Ctrl + , to open settings, and the Konami code.
 */
function SettingsHost() {
  const openSettings = useOpenSettings();
  const settings = useSettingsValue();
  const konamiEnabled = settings.easterEggs.konami;
  const ligatures = settings.editor.ligatures;
  const progress = useRef(0);

  // Drive the global --code-ligatures var consumed by every mono code surface.
  useEffect(() => {
    document.documentElement.dataset.codeLigatures = ligatures ? "on" : "off";
  }, [ligatures]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // ⌘, / Ctrl, — open settings
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        openSettings();
        return;
      }

      // Konami code — ignore while typing in an input/editor
      if (!konamiEnabled) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        progress.current = 0;
        return;
      }

      const expected = KONAMI_SEQUENCE[progress.current];
      if (e.key.toLowerCase() === expected.toLowerCase()) {
        progress.current += 1;
        if (progress.current === KONAMI_SEQUENCE.length) {
          progress.current = 0;
          fireKonamiConfetti();
        }
      } else {
        // Restart, but allow the first key to begin a fresh sequence.
        progress.current =
          e.key.toLowerCase() === KONAMI_SEQUENCE[0].toLowerCase() ? 1 : 0;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openSettings, konamiEnabled]);

  return <SettingsDialog />;
}

export default SettingsHost;
