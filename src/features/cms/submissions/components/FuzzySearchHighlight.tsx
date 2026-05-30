"use client";

import type { FuseResultMatch } from "fuse.js";
import type { ReactNode } from "react";

interface FuzzySearchHighlightProps {
  text: string;
  matches: readonly FuseResultMatch[];
  matchKey: string;
  className?: string;
}

export function FuzzySearchHighlight({
  text,
  matches,
  matchKey,
  className = "",
}: FuzzySearchHighlightProps) {
  const match = matches.find((m) => m.key === matchKey);

  if (!match || !match.indices || match.indices.length === 0) {
    return <span className={className}>{text}</span>;
  }

  const indices = match.indices;
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const [start, end] of indices) {
    if (start > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>{text.slice(lastIndex, start)}</span>,
      );
    }

    parts.push(
      <mark
        key={`mark-${start}`}
        className="bg-yellow-300 text-black font-medium rounded-sm px-0.5"
      >
        {text.slice(start, end + 1)}
      </mark>,
    );

    lastIndex = end + 1;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`text-end`}>{text.slice(lastIndex)}</span>);
  }

  return <span className={className}>{parts}</span>;
}
