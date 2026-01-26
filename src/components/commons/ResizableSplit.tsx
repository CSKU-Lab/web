import React, { useState, useRef, useCallback, useEffect } from "react";

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
  const [ratio, setRatio] = useState(initialRatio);
  const [isDrag, setIsDrag] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = direction === "horizontal";

  useEffect(() => {
    const handleDragEnd = () => setIsDrag(false);
    window.addEventListener("mouseup", handleDragEnd);
    window.addEventListener("touchend", handleDragEnd);
    return () => {
      window.removeEventListener("mouseup", handleDragEnd);
      window.removeEventListener("touchend", handleDragEnd);
    };
  }, []);

  useEffect(() => {
    if (!isDrag) return;

    const dragHandler = (position: { x: number; y: number }) => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerSize = isHorizontal
        ? containerRect.width
        : containerRect.height;
      const containerStart = isHorizontal ? containerRect.x : containerRect.y;
      const pointerPosition = isHorizontal ? position.x : position.y;

      const newRatio = (pointerPosition - containerStart) / containerSize;
      setRatio(Math.min(Math.max(newRatio, minRatio), maxRatio));
    };

    const handleMouseMove = (e: MouseEvent) =>
      dragHandler({ x: e.clientX, y: e.clientY });

    const handleTouchMove = (e: TouchEvent) =>
      dragHandler({ x: e.touches[0].clientX, y: e.touches[0].clientY });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDrag, isHorizontal, minRatio, maxRatio]);

  return (
    <div
      ref={containerRef}
      className={`flex ${isHorizontal ? "flex-row" : "flex-col"} w-full h-full ${className}`}
    >
      <div
        style={{
          [isHorizontal ? "width" : "height"]: `${ratio * 100}%`,
        }}
        className="overflow-hidden"
      >
        {left}
      </div>
      <div
        className={`${
          isHorizontal
            ? "w-1.5 hover:w-2 cursor-col-resize bg-gray-4 hover:bg-gray-6"
            : "h-1.5 hover:h-2 cursor-row-resize bg-gray-4 hover:bg-gray-6"
        } transition-all flex-shrink-0`}
        onMouseDown={() => setIsDrag(true)}
        onTouchStart={() => setIsDrag(true)}
        onDoubleClick={() => setRatio(initialRatio)}
      />
      <div
        style={{
          [isHorizontal ? "width" : "height"]: `${(1 - ratio) * 100}%`,
        }}
        className="overflow-hidden"
      >
        {right}
      </div>
    </div>
  );
}

export default ResizableSplit;
