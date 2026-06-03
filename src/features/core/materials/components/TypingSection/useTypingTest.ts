"use client";

import { useState, useCallback, useEffect, useRef } from "react";

export type CharStatus = "pending" | "current" | "correct" | "incorrect";

export interface CharState {
  char: string;
  status: CharStatus;
}

export interface TypingResults {
  rawWPM: number;
  adjWPM: number;
  errorPct: number;
  duration: number;
}

// Keystroke event logged for server-side calculation and anti-spoof validation.
// k: the key pressed ("Backspace" or a single character)
// t: ms since the first keystroke
export interface Keystroke {
  k: string;
  t: number;
}

interface UseTypingTestReturn {
  chars: CharState[];
  currentIndex: number;
  isStarted: boolean;
  isComplete: boolean;
  results: TypingResults | null;
  elapsedSeconds: number;
  liveRawWPM: number;
  keystrokes: Keystroke[];
  handleKeyDown: (e: KeyboardEvent) => void;
  reset: () => void;
}

function buildChars(text: string): CharState[] {
  return text.split("").map((char, i) => ({
    char,
    status: (i === 0 ? "current" : "pending") as CharStatus,
  }));
}

export function useTypingTest(text: string): UseTypingTestReturn {
  const [chars, setChars] = useState<CharState[]>(() => buildChars(text));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [liveRawWPM, setLiveRawWPM] = useState(0);

  const startTimeRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const charsRef = useRef<CharState[]>(chars);
  const isCompleteRef = useRef(false);
  const keystrokesRef = useRef<Keystroke[]>([]);
  // Track total errors for preview results display only
  const previewErrorsRef = useRef(0);

  useEffect(() => {
    const newChars = buildChars(text);
    charsRef.current = newChars;
    currentIndexRef.current = 0;
    startTimeRef.current = null;
    isCompleteRef.current = false;
    keystrokesRef.current = [];
    previewErrorsRef.current = 0;
    setChars(newChars);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    setElapsedSeconds(0);
    setLiveRawWPM(0);
  }, [text]);

  useEffect(() => {
    if (!startTime || isComplete) return;
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedSeconds(Math.floor(elapsed));
      const elapsedMin = elapsed / 60;
      if (elapsedMin > 0) {
        setLiveRawWPM(Math.round(currentIndexRef.current / 5 / elapsedMin));
      }
    }, 500);
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isCompleteRef.current) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key === "Tab") {
      e.preventDefault();
      return;
    }

    if (e.key === "Backspace") {
      const idx = currentIndexRef.current;
      if (idx === 0) return;
      const t = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      keystrokesRef.current = [...keystrokesRef.current, { k: "Backspace", t }];
      const newIdx = idx - 1;
      const next = charsRef.current.map((c, i) => {
        if (i === newIdx) return { ...c, status: "current" as CharStatus };
        if (i === idx) return { ...c, status: "pending" as CharStatus };
        return c;
      });
      currentIndexRef.current = newIdx;
      charsRef.current = next;
      setChars(next);
      setCurrentIndex(newIdx);
      return;
    }

    if (e.key.length !== 1) return;

    const idx = currentIndexRef.current;
    const current = charsRef.current;
    if (idx >= current.length) return;

    if (!startTimeRef.current) {
      const now = Date.now();
      startTimeRef.current = now;
      setStartTime(now);
    }

    const t = Date.now() - startTimeRef.current!;
    keystrokesRef.current = [...keystrokesRef.current, { k: e.key, t }];

    const isCorrect = e.key === current[idx].char;
    if (!isCorrect) previewErrorsRef.current += 1;
    const newIdx = idx + 1;

    const next = current.map((c, i) => {
      if (i === idx) return { ...c, status: (isCorrect ? "correct" : "incorrect") as CharStatus };
      if (i === newIdx) return { ...c, status: "current" as CharStatus };
      return c;
    });

    currentIndexRef.current = newIdx;
    charsRef.current = next;
    setChars(next);
    setCurrentIndex(newIdx);

    if (newIdx >= current.length) {
      const now = Date.now();
      isCompleteRef.current = true;
      setEndTime(now);
      setIsComplete(true);
    }
  }, []);

  // Frontend results used only for preview (PreviewModal). Actual submissions use server-calculated stats.
  const results: TypingResults | null = (() => {
    if (!isComplete || !startTime || !endTime) return null;
    const correctCount = chars.filter((c) => c.status === "correct").length;
    const totalChars = chars.length;
    const elapsedMin = (endTime - startTime) / 60000;
    return {
      rawWPM: Math.round(totalChars / 5 / elapsedMin),
      adjWPM: Math.round(correctCount / 5 / elapsedMin),
      errorPct: totalChars > 0 ? Math.round((previewErrorsRef.current / totalChars) * 1000) / 10 : 0,
      duration: Math.round((endTime - startTime) / 100) / 10,
    };
  })();

  const reset = useCallback(() => {
    const newChars = buildChars(text);
    charsRef.current = newChars;
    currentIndexRef.current = 0;
    startTimeRef.current = null;
    isCompleteRef.current = false;
    keystrokesRef.current = [];
    previewErrorsRef.current = 0;
    setChars(newChars);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    setElapsedSeconds(0);
    setLiveRawWPM(0);
  }, [text]);

  return {
    chars,
    currentIndex,
    isStarted: startTime !== null,
    isComplete,
    results,
    elapsedSeconds,
    liveRawWPM,
    keystrokes: keystrokesRef.current,
    handleKeyDown,
    reset,
  };
}
