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

  return (
    <div className="flex flex-col h-full">
      <ChatPanel probIDs={probIDs} />
    </div>
  );
}
