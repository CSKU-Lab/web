"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { LucideSend } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Maximize2, Minimize2 } from "lucide-react";
import { ChatMessages } from "./ChatMessages";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "0px";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

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
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isFullscreen ? "inset-4" : "bottom-0 right-6 w-full max-w-md"
      }`}
    >
      <Accordion
        type="single"
        collapsible={!isFullscreen}
        value={chatOpen ? "chat" : ""}
        onValueChange={(val) => {
          setChatOpen(val === "chat");
        }}
      >
        <AccordionItem value="chat" className="border-none">
          <div className="relative">
            <AccordionTrigger
              className="bg-black text-white px-4 py-3 shadow hover:no-underline w-fit min-w-[200px]"
              showChevron={false}
            >
              AI Assistant
            </AccordionTrigger>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen((prev) => !prev);
                setChatOpen(true);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:scale-110"
            >
              {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>
          <AccordionContent
            className={`bg-(--gray-1) dark:bg-zinc-900 shadow-xl border flex flex-col ${
              isFullscreen ? "h-[90vh]" : "h-[500px]"
            }`}
          >
            <ChatMessages messages={messages} status={status} />
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
