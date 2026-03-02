import { useChat } from "@ai-sdk/react";
import ChatPanel from "~/components/commons/ChatPanel";

export default function AIAssistantTab({
  chat,
}: {
  chat: ReturnType<typeof useChat>;
}) {
  const { messages, sendMessage, status } = chat;

  return (
    <div className="flex flex-col h-full">
      <ChatPanel
        messages={messages}
        sendMessage={sendMessage}
        status={status}
      />
    </div>
  );
}
