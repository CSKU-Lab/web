type SSEOptions = {
  method?: "GET" | "POST";
  withCredentials?: boolean;
  onMessage?: (event: string | undefined, data: string) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
  body: Record<string, any>;
} & Omit<RequestInit, "body">;

export const fetchSSE = async (url: string, options: SSEOptions) => {
  if (options.method === "GET") {
    return createEventSource(url, options);
  }

  try {
    const res = await fetch(url, {
      method: options.method,
      credentials: options.withCredentials ? "include" : undefined,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...options.headers,
      },
      body: JSON.stringify(options.body),
    });

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    if (!res.body) {
      throw new Error("Response body is null");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        options.onClose?.();
        return;
      }

      buffer += decoder.decode(value, { stream: true });
      console.log(buffer);
      const messages = buffer.split("\n\n");
      buffer = messages.pop() || "";

      for (const message of messages) {
        if (!message.trim()) continue;

        const lines = message.split("\n");
        let data = "";
        let eventType: string | undefined = undefined;

        for (const line of lines) {
          if (line.startsWith("data:")) {
            let cleanedData = line.replace(/data:\s*/, "");
            data += cleanedData + "\n";
          } else if (line.startsWith("event:")) {
            eventType = line.replace(/event:\s*/, "");
          }
        }
        if (data) {
          options.onMessage?.(eventType, data.trim());
        }
      }
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      options.onClose?.();
    } else {
      options.onError?.(err);
    }
  }
};

const createEventSource = (url: string, options: SSEOptions) => {
  const eventSource = new EventSource(url, {
    withCredentials: options.withCredentials,
  });

  eventSource.onmessage = (event) => {
    options.onMessage?.(event.type, event.data);
  };

  eventSource.onerror = (error) => {
    options.onError?.(error);
    eventSource.close();
  };

  return eventSource;
};
