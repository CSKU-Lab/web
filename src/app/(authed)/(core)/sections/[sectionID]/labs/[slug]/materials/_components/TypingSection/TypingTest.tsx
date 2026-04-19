"use client";

import { useEffect, useRef } from "react";
import { useTypingTest } from "./useTypingTest";
import TypingDisplay from "./TypingDisplay";
import StatsBar from "./StatsBar";
import ResultsOverlay from "./ResultsOverlay";

interface Props {
  text: string;
  onComplete?: (typedText: string) => void;
  onRetry?: () => void;
  isSubmitting?: boolean;
  submitError?: Error | null;
  isSubmitted?: boolean;
}

export default function TypingTest({
  text,
  onComplete,
  onRetry,
  isSubmitting = false,
  submitError = null,
  isSubmitted = false,
}: Props) {
  const {
    chars,
    currentIndex,
    isStarted,
    isComplete,
    results,
    elapsedSeconds,
    liveRawWPM,
    typedText,
    handleKeyDown,
    reset,
  } = useTypingTest(text);

  const inputRef = useRef<HTMLInputElement>(null);
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Auto-submit when typing is complete
  useEffect(() => {
    if (isComplete && onComplete && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      onComplete(typedText);
    }
  }, [isComplete, onComplete, typedText]);

  // Reset hasSubmitted when text changes (retry)
  useEffect(() => {
    hasSubmittedRef.current = false;
  }, [text]);

  const handleRestart = () => {
    hasSubmittedRef.current = false;
    reset();
    onRetry?.();
  };

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
      {isComplete && results ? (
        <ResultsOverlay
          results={results}
          onRestart={handleRestart}
          isSubmitting={isSubmitting}
          submitError={submitError}
          isSubmitted={isSubmitted}
        />
      ) : (
        <>
          <StatsBar elapsedSeconds={elapsedSeconds} liveRawWPM={liveRawWPM} isStarted={isStarted} />
          <div className="w-full max-w-3xl">
            <TypingDisplay chars={chars} currentIndex={currentIndex} />
          </div>
          {!isStarted && (
            <p className="mt-6 text-xs text-(--gray-9) font-mono">click here or start typing</p>
          )}
        </>
      )}
    </div>
  );
}
