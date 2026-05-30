"use client";

import { cn } from "~/lib/utils";
import type { CharState } from "~/features/core/materials/components/TypingSection/useTypingTest";

interface Props {
  chars: CharState[];
  currentIndex: number;
}

export default function TypingDisplay({ chars, currentIndex }: Props) {
  return (
    <p className="font-mono text-2xl leading-relaxed tracking-wide select-none">
      {chars.map((c, i) => (
        <span
          key={i}
          className={cn(
            "relative",
            c.status === "pending" && "text-(--gray-8)",
            c.status === "correct" && "text-green-400",
            c.status === "incorrect" && "text-red-400",
            c.status === "current" && "text-white",
            c.status === "current" &&
              "after:absolute after:left-0 after:-bottom-0.5 after:w-full after:h-0.5 after:bg-white after:animate-pulse",
          )}
        >
          {c.char === " " && c.status === "incorrect" ? "\u00B7" : c.char}
        </span>
      ))}
    </p>
  );
}
