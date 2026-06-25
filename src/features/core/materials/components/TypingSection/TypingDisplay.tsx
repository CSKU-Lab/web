"use client";

import { cn } from "~/lib/utils";
import type { CharState } from "~/features/core/materials/components/TypingSection/useTypingTest";

interface Props {
  chars: CharState[];
  currentIndex: number;
}

export default function TypingDisplay({ chars, currentIndex }: Props) {
  return (
    <p className="font-mono text-2xl leading-relaxed tracking-wide select-none whitespace-pre-wrap break-words">
      {chars.map((c, i) => {
        const isNewline = c.char === "\n";
        const isTab = c.char === "\t";
        return (
          <span
            key={i}
            className={cn(
              "inline",
              c.status === "pending" && "text-(--gray-8)",
              c.status === "correct" && "text-(--grass-10)",
              c.status === "incorrect" && "text-(--tomato-10)",
              c.status === "current" && "text-(--gray-12)",
              c.status === "current" && "border-b-2 border-(--gray-12) animate-pulse",
              (c.char === " " || isTab || isNewline) &&
                c.status === "incorrect" &&
                "bg-(--tomato-3) rounded-sm",
            )}
          >
            {isNewline ? (
              // Show a return glyph so the student knows to press Enter, then
              // keep the real line break (whitespace-pre-wrap renders it).
              <>
                <span className="opacity-40">↵</span>
                {"\n"}
              </>
            ) : isTab ? (
              // Show a tab glyph plus the real tab whitespace.
              <>
                <span className="opacity-40">⇥</span>
                {"\t"}
              </>
            ) : (
              c.char
            )}
          </span>
        );
      })}
    </p>
  );
}
