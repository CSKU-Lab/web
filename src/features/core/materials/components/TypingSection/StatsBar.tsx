"use client";

interface Props {
  elapsedSeconds: number;
  liveRawWPM: number;
  isStarted: boolean;
}

export default function StatsBar({ elapsedSeconds, liveRawWPM, isStarted }: Props) {
  return (
    <div className="flex gap-8 text-(--gray-11) text-sm font-mono mb-6">
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs uppercase tracking-widest text-(--gray-9)">wpm</span>
        <span className="text-2xl text-(--gray-12)">{isStarted ? liveRawWPM : "-"}</span>
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs uppercase tracking-widest text-(--gray-9)">time</span>
        <span className="text-2xl text-(--gray-12)">{isStarted ? elapsedSeconds : "-"}</span>
      </div>
    </div>
  );
}
