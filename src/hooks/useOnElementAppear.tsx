import { useEffect, useRef } from "react";

interface Args {
  onAppear: () => unknown;
  enabled?: boolean;
}

function useOnElementAppear({ onAppear, enabled }: Args) {
  const eleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!eleRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onAppear();
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    if (!enabled) {
      observer.disconnect();
      return;
    }

    observer.observe(eleRef.current);

    return () => observer.disconnect();
  }, [enabled, onAppear]);

  return eleRef;
}

export default useOnElementAppear;
