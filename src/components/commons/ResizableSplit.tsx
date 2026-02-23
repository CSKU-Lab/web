import { GripVertical } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";
import useDrag from "~/hooks/useDrag";

interface ResizableSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialRatio?: number;
  minRatio?: number;
  maxRatio?: number;
  direction?: "horizontal" | "vertical";
  className?: string;
}

export function ResizableSplit({
  left,
  right,
  initialRatio = 0.5,
  minRatio = 0.2,
  maxRatio = 0.8,
  direction = "horizontal",
  className = "",
}: ResizableSplitProps) {
  const initialPercent = initialRatio * 100;
  const minPercent = minRatio * 100;
  const maxPercent = maxRatio * 100;

  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: initialPercent,
    direction,
    mode: "percent",
  });

  const isHorizontal = direction === "horizontal";
  const clampedSize = Math.min(Math.max(size, minPercent), maxPercent);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex w-full h-full",
        isHorizontal ? "flex-row" : "flex-col",
        className
      )}
    >
      <div
        style={{
          [isHorizontal ? "width" : "height"]: `${clampedSize}%`,
        }}
        className="overflow-hidden border-r"
      >
        {left}
      </div>
      <button
        {...events}
        ref={buttonRef}
        className={cn(
          "bg-(--gray-1) border rounded z-10 cursor-grab active:cursor-grabbing active:bg-(--gray-1)/90 flex items-center justify-center",
          isHorizontal
            ? "w-4 h-8 absolute top-1/2 -translate-y-1/2"
            : "h-4 w-8 absolute left-1/2 -translate-x-1/2"
        )}
        style={{
          [isHorizontal ? "left" : "top"]: `${clampedSize}%`,
          [isHorizontal ? "marginLeft" : "marginTop"]: "-8px",
        }}
      >
        <GripVertical size="0.9rem" />
      </button>
      <div
        style={{
          [isHorizontal ? "width" : "height"]: `${100 - clampedSize}%`,
        }}
        className="overflow-hidden"
      >
        {right}
      </div>
    </div>
  );
}

export default ResizableSplit;
