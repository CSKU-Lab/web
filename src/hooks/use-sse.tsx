import { useEffect } from "react";
import { fetchSSE } from "~/lib/sse-handler";

interface UseSSEArgs {
  url: string;
  onMessage: (eventType: string | undefined, data: string) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

function useSSE({ url, ...args }: UseSSEArgs) {
  useEffect(() => {
    const abortController = new AbortController();
    fetchSSE(url, {
      signal: abortController.signal,
      ...args,
    });

    return () => {
      abortController.abort();
    };
  }, [url, args]);
}

export default useSSE;
