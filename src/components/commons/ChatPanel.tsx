"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { LucideSend } from "lucide-react";
import { ChatMessages } from "./ChatMessages";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface ChatPanelProps {
  messages: ReturnType<typeof useChat>["messages"];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ReturnType<typeof useChat>["status"];
  className?: string;
  showMessages?: boolean;
}

export default function ChatPanel({
  messages,
  sendMessage,
  status,
  className,
  showMessages = true,
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    if (!input) {
      el.style.height = "40px";
      return;
    }

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className={cn("flex flex-col h-full w-full", className)}>
      {showMessages !== false && (
        <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
          <ChatMessages messages={messages} status={status} />
        </div>
      )}
      <form
        className={cn(
          "flex items-end gap-2 p-4",
          showMessages !== false && "border-t dark:border-zinc-800"
        )}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          className="flex-1 p-3 border rounded-md bg-background resize-none overflow-hidden min-h-[40px] focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          value={input}
          placeholder="Ask anything..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          type="submit"
          size="icon"
          disabled={status !== "ready"}
          className="shrink-0"
        >
          <LucideSend size="1rem" />
        </Button>
      </form>
    </div>
  );
}
