import { useEffect, useRef, useState } from "react";

interface Props {
  initialSize?: number;
  direction?: "horizontal" | "vertical";
}

function useDrag({ initialSize = 500, direction = "horizontal" }: Props) {
  const [isDrag, setIsDrag] = useState(false);
  const [size, setSize] = useState(initialSize);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleDragEnd = () => {
      setIsDrag(false);
    };

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
      const button = buttonRef.current;

      if (!container || !button) return;

      const containerRect = container.getBoundingClientRect();

      if (direction === "horizontal") {
        const pointerPosition = position.x;
        const containerOffset = containerRect.x;
        const dragButtonWidth = button.clientWidth;
        const buttonMargin =
          parseFloat(window.getComputedStyle(button).marginLeft) || 0;

        setSize(
          pointerPosition -
            containerOffset -
            dragButtonWidth -
            buttonMargin / 2,
        );
      }

      if (direction === "vertical") {
        const pointerPosition = position.y;
        const containerBottom = containerRect.bottom;
        const buttonMargin =
          parseFloat(window.getComputedStyle(button).marginTop) || 0;

        setSize(
          Math.max(0, containerBottom - pointerPosition - buttonMargin / 2),
        );
      }
    };

    const handleMouseMove = (e: MouseEvent) =>
      dragHandler({ x: e.clientX, y: e.clientY });

    const handleTouchMove = (e: TouchEvent) => {
      dragHandler({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDrag, direction]);

  const onDoubleClick = () => setSize(initialSize);
  const onMouseDown = () => setIsDrag(true);
  const onTouchStart = () => setIsDrag(true);

  const events = { onMouseDown, onDoubleClick, onTouchStart };

  return { isDrag, size, containerRef, buttonRef, events };
}

export default useDrag;
