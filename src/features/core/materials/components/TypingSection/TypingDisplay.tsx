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
      {chars.map((c, i) => (
        <span
          key={i}
          className={cn(
            "inline",
            c.status === "pending" && "text-(--gray-8)",
            c.status === "correct" && "text-(--grass-10)",
            c.status === "incorrect" && "text-(--tomato-10)",
            c.status === "current" && "text-(--gray-12)",
            c.status === "current" && "border-b-2 border-(--gray-12) animate-pulse",
            c.char === " " && c.status === "incorrect" && "bg-(--tomato-3) rounded-sm",
          )}
        >
          {c.char}
        </span>
      ))}
    </p>
  );
}
