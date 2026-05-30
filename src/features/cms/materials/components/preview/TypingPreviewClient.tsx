"use client";

import TypingTest from "~/app/(authed)/(core)/sections/[sectionID]/labs/[slug]/materials/_components/TypingSection/TypingTest";

interface Props {
  text: string;
}

export default function TypingPreviewClient({ text }: Props) {
  if (!text) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <span className="text-(--gray-10) text-sm">No text set for this material.</span>
      </div>
    );
  }
  return <TypingTest text={text} />;
}
