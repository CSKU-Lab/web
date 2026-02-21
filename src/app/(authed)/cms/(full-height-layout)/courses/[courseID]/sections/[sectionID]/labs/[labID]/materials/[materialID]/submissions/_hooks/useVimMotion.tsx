import { useEffect, useMemo, useRef, useState } from "react";

interface Args {
  maxIndex: number;
  registerEvents?: Record<string, () => void>;
}

function useVimMotion({ maxIndex, registerEvents = {} }: Args) {
  const searchRef = useRef<HTMLInputElement>(null);
  const lastGPressRef = useRef<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const DEFAULT_EVENTS = useMemo(
    () =>
      ({
        j: () => {
          let newIndex: number;
          if (currentIndex === -1) {
            newIndex = 0;
          } else {
            newIndex = Math.min(currentIndex + 1, maxIndex);
          }
          setCurrentIndex(newIndex);
        },
        k: () => {
          let newIndex: number;
          if (currentIndex === -1) {
            newIndex = maxIndex;
          } else {
            newIndex = Math.max(currentIndex - 1, 0);
          }
          setCurrentIndex(newIndex);
        },
        g: () => {
          const now = Date.now();
          if (now - lastGPressRef.current < 500) {
            setCurrentIndex(0);
            lastGPressRef.current = 0;
          } else {
            lastGPressRef.current = now;
          }
        },
        G: () => {
          setCurrentIndex(maxIndex);
        },
      }) as Record<string, () => void>,
    [currentIndex, maxIndex],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isTypingField =
        activeEl instanceof HTMLInputElement ||
        activeEl instanceof HTMLTextAreaElement ||
        activeEl?.getAttribute("contenteditable") === "true";

      if (isTypingField && e.key !== "/") {
        return;
      }

      const allEvents = { ...DEFAULT_EVENTS, ...registerEvents };
      const eventKeys = Object.keys(allEvents);

      if (!eventKeys.includes(e.key)) return;

      allEvents[e.key]();

      e.preventDefault();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, maxIndex, DEFAULT_EVENTS, registerEvents]);

  return { searchRef, currentIndex, setCurrentIndex };
}

export default useVimMotion;
