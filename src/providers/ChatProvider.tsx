"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { GripVertical, MessageCircleMore } from "lucide-react";
import useDrag from "~/hooks/useDrag";
import ChatPanel from "~/components/commons/ChatPanel";

const COLLAPSED_WIDTH = 54;

export default function ChatProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapse, setIsCollapse] = useState(true);

  const { containerRef, buttonRef, size, events, isDrag } = useDrag({
    initialSize: 400,
    direction: "horizontal",
    anchor: "right",
  });

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 overflow-hidden">{children}</div>

      <motion.aside
        ref={containerRef}
        animate={{
          width: isCollapse ? COLLAPSED_WIDTH : size,
        }}
        transition={
          isDrag ? { duration: 0 } : { type: "tween", duration: 0.25 }
        }
        className="relative flex flex-col border-l bg-white dark:bg-zinc-900 h-screen"
      >
        <div className="flex items-center p-3 ">
          <button
            onClick={() => setIsCollapse((p) => !p)}
            className="mr-2 text-zinc-500 hover:text-blue-500"
          >
            <MessageCircleMore size="1.2rem" />
          </button>

          <AnimatePresence>
            {!isCollapse && (
              <motion.h1
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="whitespace-nowrap"
              >
                AI Assistant
              </motion.h1>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {!isCollapse && (
            <motion.div
              key="chat-content"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="relative flex flex-col flex-1 min-h-0"
            >
              <button
                {...events}
                ref={buttonRef}
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-zinc-200 dark:bg-zinc-700 border rounded cursor-grab active:cursor-grabbing flex items-center justify-center"
              >
                <GripVertical size="0.9rem" />
              </button>

              <div className="overflow-hidden flex-1">
                <ChatPanel />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </div>
  );
}
