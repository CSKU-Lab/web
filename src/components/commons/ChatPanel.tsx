"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { LucideSend } from "lucide-react";
import { ChatMessages } from "./ChatMessages";

interface ChatPanelProps {
  messages: ReturnType<typeof useChat>["messages"];
  sendMessage: ReturnType<typeof useChat>["sendMessage"];
  status: ReturnType<typeof useChat>["status"];
}

export default function ChatPanel({
  messages,
  sendMessage,
  status,
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
    <div className="flex flex-col h-full w-full ">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <ChatMessages messages={messages} status={status} />
      </div>
      <form
        className="p-3 border-t dark:border-zinc-800 flex items-end gap-2 bg-(--gray-1) dark:bg-zinc-900"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-(--gray-1) dark:bg-zinc-800 resize-none overflow-y-auto max-h-40 min-h-[40px]"
          value={input}
          placeholder="Say something..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="bg-black text-white p-2 rounded disabled:opacity-50 h-10 w-10 flex items-center justify-center shrink-0"
          disabled={status !== "ready"}
        >
          <LucideSend size="1.2rem" />
        </button>
      </form>
    </div>
  );
}
