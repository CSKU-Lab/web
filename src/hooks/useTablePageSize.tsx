import { useEffect, useState, useRef, useCallback } from "react";

interface UseTablePageSizeOptions {
  rowHeight?: number;
  headerHeight?: number;
  footerHeight?: number;
  buffer?: number;
}

function useTablePageSize(options: UseTablePageSizeOptions = {}) {
  const { rowHeight = 48, headerHeight = 36, footerHeight = 44, buffer = 28 } = options;

  const containerRef = useRef<HTMLDivElement>(null);
  const [pageSize, setPageSize] = useState<number | null>(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculatePageSize = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerHeight = container.clientHeight;
    if (containerHeight <= 0) return;

    const availableHeight = containerHeight - headerHeight - footerHeight - buffer;
    if (availableHeight <= 0) return;

    const calculatedRows = Math.floor(availableHeight / rowHeight);
    const finalPageSize = Math.max(1, calculatedRows);

    setPageSize((prev) => {
      if (prev !== finalPageSize) {
        setHasCalculated(true);
      }
      return finalPageSize;
    });
  }, [rowHeight, headerHeight, footerHeight, buffer]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    calculatePageSize();

    const resizeObserver = new ResizeObserver(() => {
      calculatePageSize();
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [calculatePageSize]);

  return { containerRef, pageSize, hasCalculated };
}

export default useTablePageSize;
