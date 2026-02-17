"use client";

import { UIMessage, useChat } from "@ai-sdk/react";
import { useState } from "react";
import { LucideSend } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ChatStatus } from "ai";
import { chatInstance } from "~/lib/aiChatProviders/openrouter";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat();

  return (
    <div className="fixed bottom-0 right-6 w-full max-w-md z-50">
      <Accordion type="single" collapsible defaultValue="chat">
        <AccordionItem value="chat" className="border-none">
          <AccordionTrigger className="bg-black text-white px-4 py-3 shadow hover:no-underline">
            AI Assistant
          </AccordionTrigger>
          <AccordionContent className="bg-white dark:bg-zinc-900 shadow-xl border h-[500px] flex flex-col">
            <ChatMessages messages={messages} status={status} />
            <form
              className="p-3 border-t dark:border-zinc-800 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!input.trim()) return;
                if (status !== "ready") return;

                sendMessage({ text: input });
                setInput("");
              }}
            >
              <input
                className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800"
                value={input}
                placeholder="Say something..."
                onChange={(e) => setInput(e.currentTarget.value)}
              />
              <button
                className="bg-black text-white p-2 rounded disabled:opacity-50"
                disabled={status !== "ready"}
              >
                <LucideSend size="1.5rem" />
              </button>
            </form>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

const ChatMessages = ({
  messages,
  status,
}: {
  messages: UIMessage[];
  status: ChatStatus;
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="space-y-2">
          {message.parts.map((part, i) => {
            const key = `${message.id}-${i}`;

            if (chatInstance.toolMapper(part.type)) {
              const toolName = part.type;

              return (
                <div key={key} className="flex justify-center">
                  <div className="text-xs text-zinc-500 dark:bg-zinc-800 px-3 py-1 rounded-full">
                    Using {toolName}
                  </div>
                </div>
              );
            }

            if (part.type === "text") {
              return (
                <div
                  key={key}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`bg-zinc-200 dark:bg-zinc-800 w-fit max-w-[85%] rounded-t-md p-2 break-words ${
                      message.role === "user"
                        ? "rounded-bl-md"
                        : "rounded-br-md"
                    }`}
                  >
                    {part.text}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      ))}

      {status === "submitted" && (
        <div className="flex justify-start">
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-t-md roudned-bl-md p-2 animate-pulse">
            Thinking...
          </div>
        </div>
      )}
    </div>
  );
};
