"use client";
import ChatPanel from "~/components/commons/ChatPanel";
import type { ChildrenProps } from "~/types/children-props";

function ChatProvider({ children }: ChildrenProps) {
  return (
    <>
      {children}
      <ChatPanel />
    </>
  );
}

export default ChatProvider;
