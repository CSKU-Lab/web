import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useParams } from "next/navigation";
import { ProblemProps } from "~/app/api/chat/route";
import ChatPanel from "~/components/commons/ChatPanel";

export default function AIAssistantTab() {
  const {
    materialID,
    sectionID,
    slug: labID,
  } = useParams<{ materialID: string; sectionID: string; slug: string }>();

  const probIDs: ProblemProps = {
    materialID,
    sectionID,
    labID,
  };

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        probIDs,
      },
    }),
  });

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
