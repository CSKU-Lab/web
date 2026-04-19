"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "~/components/ui/button";
import { MessageSquare, BookOpen, Code2, Lightbulb, HelpCircle, Send } from "lucide-react";
import { useState } from "react";

const SUGGESTED_TOPICS = [
  {
    icon: BookOpen,
    title: "Course Content",
    prompt: "Help me understand the course structure and learning objectives",
    color: "text-blue-500",
  },
  {
    icon: Code2,
    title: "Code Help",
    prompt: "I need help debugging my code or understanding a concept",
    color: "text-purple-500",
  },
  {
    icon: Lightbulb,
    title: "Lab Assignments",
    prompt: "Can you explain the requirements for the current lab assignment?",
    color: "text-amber-500",
  },
  {
    icon: HelpCircle,
    title: "General Questions",
    prompt: "I have a question about the CMS or platform features",
    color: "text-emerald-500",
  },
];

export default function ChatHome() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/cms/chat",
    }),
  });

  const [input, setInput] = useState("");
  const hasMessages = messages.length > 0;

  const handleSuggestedTopic = (prompt: string) => {
    sendMessage({ text: prompt });
  };

  const handleSendMessage = () => {
    if (!input.trim() || status !== "ready") return;
    sendMessage({ text: input });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-gradient-to-b from-background to-muted/20">
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-2 ring-1 ring-primary/20">
              <MessageSquare size="2rem" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                AI Teaching Assistant
              </h1>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Your personal helper for coursework, coding questions, and lab assignments
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {SUGGESTED_TOPICS.map((topic, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedTopic(topic.prompt)}
                className="group relative flex items-start gap-4 p-5 rounded-xl border bg-card hover:bg-accent/50 hover:border-accent/50 transition-all duration-200 text-left shadow-sm hover:shadow-md"
              >
                <div className={`size-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform ${topic.color}`}>
                  <topic.icon size="1.25rem" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="font-semibold text-sm">{topic.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed break-words">
                    {topic.prompt}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 p-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-end gap-3 p-2 rounded-2xl border bg-card shadow-lg shadow-muted/50">
              <textarea
                rows={3}
                className="flex-1 bg-transparent border-none resize-none outline-none text-sm min-h-[60px] max-h-48 py-3 px-3 placeholder:text-muted-foreground/70"
                value={input}
                placeholder="Ask me anything..."
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim() || status !== "ready"}
                size="icon"
                className="size-11 rounded-xl shrink-0 mb-0.5"
              >
                <Send size="1.1rem" />
              </Button>
            </div>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
