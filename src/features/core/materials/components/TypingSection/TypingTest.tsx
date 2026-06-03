"use client";

import { useEffect, useRef } from "react";
import { History } from "lucide-react";
import { useTypingTest, type TypingResults, type Keystroke } from "~/features/core/materials/components/TypingSection/useTypingTest";
import TypingDisplay from "~/features/core/materials/components/TypingSection/TypingDisplay";
import StatsBar from "~/features/core/materials/components/TypingSection/StatsBar";

interface Props {
  text: string;
  onComplete?: (keystrokes: Keystroke[]) => void;
  onResults?: (results: TypingResults) => void;
  onStarted?: () => void;
  onRetry?: () => void;
  onViewSubmissions?: () => void;
}

export default function TypingTest({
  text,
  onComplete,
  onResults,
  onStarted,
  onRetry,
  onViewSubmissions,
}: Props) {
  const {
    chars,
    currentIndex,
    isStarted,
    isComplete,
    results,
    elapsedSeconds,
    liveRawWPM,
    keystrokes,
    handleKeyDown,
    reset,
  } = useTypingTest(text);

  const inputRef = useRef<HTMLInputElement>(null);
  const hasSubmittedRef = useRef(false);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (isStarted && !hasStartedRef.current) {
      hasStartedRef.current = true;
      onStarted?.();
    }
  }, [isStarted, onStarted]);

  // Fire results + submit when complete — parent switches view immediately
  useEffect(() => {
    if (isComplete && results && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      onResults?.(results);
      onComplete?.(keystrokes);
    }
  }, [isComplete, results, onComplete, onResults, keystrokes]);

  useEffect(() => {
    hasSubmittedRef.current = false;
    hasStartedRef.current = false;
  }, [text]);

  const handleRestart = () => {
    hasSubmittedRef.current = false;
    reset();
    onRetry?.();
  };

  // ESC to restart
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleRestart();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center bg-(--gray-1) px-8 py-12 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className="sr-only"
        autoFocus
        readOnly
        aria-label="Typing test input"
      />

      {!isStarted && onViewSubmissions && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewSubmissions();
          }}
          className="flex items-center gap-2 px-3 py-1.5 mb-8 text-xs text-(--gray-11) hover:text-(--gray-12) bg-(--gray-2) hover:bg-(--gray-3) border border-(--gray-4) rounded-md transition-colors"
        >
          <History size="0.875rem" />
          All Submissions
        </button>
      )}

      <StatsBar elapsedSeconds={elapsedSeconds} liveRawWPM={liveRawWPM} isStarted={isStarted} />
      <div className="w-full max-w-3xl">
        <TypingDisplay chars={chars} currentIndex={currentIndex} />
      </div>
      {!isStarted ? (
        <p className="mt-6 text-xs text-(--gray-9) font-mono">click here or start typing</p>
      ) : (
        <p className="mt-6 text-xs text-(--gray-9) font-mono opacity-40">esc to restart</p>
      )}
    </div>
  );
}
