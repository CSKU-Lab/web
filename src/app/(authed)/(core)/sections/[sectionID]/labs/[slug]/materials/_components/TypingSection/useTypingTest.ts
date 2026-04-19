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

interface UseTypingTestReturn {
  chars: CharState[];
  currentIndex: number;
  isStarted: boolean;
  isComplete: boolean;
  results: TypingResults | null;
  elapsedSeconds: number;
  liveRawWPM: number;
  typedText: string;
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
  const [typedText, setTypedText] = useState("");

  const startTimeRef = useRef<number | null>(null);
  const currentIndexRef = useRef(0);
  const charsRef = useRef<CharState[]>(chars);
  const isCompleteRef = useRef(false);
  const typedTextRef = useRef("");

  useEffect(() => {
    const newChars = buildChars(text);
    charsRef.current = newChars;
    currentIndexRef.current = 0;
    startTimeRef.current = null;
    isCompleteRef.current = false;
    typedTextRef.current = "";
    setChars(newChars);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    setElapsedSeconds(0);
    setLiveRawWPM(0);
    setTypedText("");
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
      const newIdx = idx - 1;
      const next = charsRef.current.map((c, i) => {
        if (i === newIdx) return { ...c, status: "current" as CharStatus };
        if (i === idx) return { ...c, status: "pending" as CharStatus };
        return c;
      });
      currentIndexRef.current = newIdx;
      charsRef.current = next;
      // Remove last character from typed text
      const newTypedText = typedTextRef.current.slice(0, -1);
      typedTextRef.current = newTypedText;
      setTypedText(newTypedText);
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

    const isCorrect = e.key === current[idx].char;
    const newIdx = idx + 1;

    const next = current.map((c, i) => {
      if (i === idx) return { ...c, status: (isCorrect ? "correct" : "incorrect") as CharStatus };
      if (i === newIdx) return { ...c, status: "current" as CharStatus };
      return c;
    });

    currentIndexRef.current = newIdx;
    charsRef.current = next;
    // Add typed character to typed text
    const newTypedText = typedTextRef.current + e.key;
    typedTextRef.current = newTypedText;
    setTypedText(newTypedText);
    setChars(next);
    setCurrentIndex(newIdx);

    if (newIdx >= current.length) {
      const now = Date.now();
      isCompleteRef.current = true;
      setEndTime(now);
      setIsComplete(true);
    }
  }, []);

  const results: TypingResults | null = (() => {
    if (!isComplete || !startTime || !endTime) return null;
    const correctCount = chars.filter((c) => c.status === "correct").length;
    const incorrectCount = chars.filter((c) => c.status === "incorrect").length;
    const totalTyped = correctCount + incorrectCount;
    const elapsedMin = (endTime - startTime) / 60000;
    return {
      rawWPM: Math.round(totalTyped / 5 / elapsedMin),
      adjWPM: Math.round(correctCount / 5 / elapsedMin),
      errorPct: totalTyped > 0 ? Math.round((incorrectCount / totalTyped) * 1000) / 10 : 0,
      duration: Math.round((endTime - startTime) / 100) / 10,
    };
  })();

  const reset = useCallback(() => {
    const newChars = buildChars(text);
    charsRef.current = newChars;
    currentIndexRef.current = 0;
    startTimeRef.current = null;
    isCompleteRef.current = false;
    typedTextRef.current = "";
    setChars(newChars);
    setCurrentIndex(0);
    setStartTime(null);
    setEndTime(null);
    setIsComplete(false);
    setElapsedSeconds(0);
    setLiveRawWPM(0);
    setTypedText("");
  }, [text]);

  return {
    chars,
    currentIndex,
    isStarted: startTime !== null,
    isComplete,
    results,
    elapsedSeconds,
    liveRawWPM,
    typedText,
    handleKeyDown,
    reset,
  };
}
