"use client";

import { useState, useEffect, useRef } from "react";
import { Eye } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { useAtomValue } from "jotai";
import { typingTextAtom } from "~/features/cms/materials/types/TypingMaterial/stores/typing-text.store";
import { useTypingTest } from "~/app/(authed)/(core)/sections/[sectionID]/labs/[slug]/materials/_components/TypingSection/useTypingTest";
import TypingDisplay from "~/app/(authed)/(core)/sections/[sectionID]/labs/[slug]/materials/_components/TypingSection/TypingDisplay";
import StatsBar from "~/app/(authed)/(core)/sections/[sectionID]/labs/[slug]/materials/_components/TypingSection/StatsBar";
import ResultsOverlay from "~/app/(authed)/(core)/sections/[sectionID]/labs/[slug]/materials/_components/TypingSection/ResultsOverlay";

function TypingPreview({ text }: { text: string }) {
  const {
    chars,
    currentIndex,
    isStarted,
    isComplete,
    results,
    elapsedSeconds,
    liveRawWPM,
    handleKeyDown,
    reset,
  } = useTypingTest(text);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[400px] bg-(--gray-1) rounded-lg p-8 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <input
        ref={inputRef}
        className="sr-only"
        autoFocus
        readOnly
        aria-label="Typing preview input"
      />
      {isComplete && results ? (
        <ResultsOverlay results={results} onRestart={reset} />
      ) : (
        <>
          <StatsBar
            elapsedSeconds={elapsedSeconds}
            liveRawWPM={liveRawWPM}
            isStarted={isStarted}
          />
          <div className="w-full">
            <TypingDisplay chars={chars} currentIndex={currentIndex} />
          </div>
          {!isStarted && (
            <p className="mt-6 text-xs text-(--gray-9) font-mono">
              click here or start typing
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default function PreviewModal() {
  const [open, setOpen] = useState(false);
  const text = useAtomValue(typingTextAtom);

  return (
    <>
      <Button variant="primary" onClick={() => setOpen(true)} disabled={!text.trim()}>
        <Eye size="1rem" />
        Preview
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          {open && <TypingPreview text={text} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
