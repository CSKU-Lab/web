"use client";

import { GripVertical } from "lucide-react";
import SubmissionsTab from "~/features/core/materials/components/SubmissionsTab";
import { useAtom } from "jotai";
import { activeLeftTabAtom } from "~/features/core/materials/stores/submission.store";
import useDrag from "~/hooks/useDrag";
import { cn } from "~/lib/utils";
import DescriptionTab from "~/features/core/materials/components/DescriptionTab";
import AIAssistantTab from "~/features/core/materials/components/AIAssistantTab";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ProblemProps } from "~/app/api/chat/route";
import { useParams } from "next/navigation";

interface TabButtonProps {
  isActive?: boolean;
  onClick?: () => void;
  value: string;
}

const TabButton = ({ isActive, onClick, value }: TabButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "border-b p-2 flex-1 border-r text-(--gray-11) hover:bg-(--gray-2)",
        isActive && "text-(--gray-1) bg-(--gray-12) hover:bg-(--gray-12)/90",
      )}
    >
      <h4 className="text-xs">{value}</h4>
    </button>
  );
};

function LeftSection() {
  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 500,
    direction: "horizontal",
  });
  const [selectedTab, setSelectedTab] = useAtom(activeLeftTabAtom);

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

  const chat = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        probIDs,
      },
    }),
  });

  const renderContent = () => {
    switch (selectedTab) {
      case "description":
        return <DescriptionTab />;

      case "submissions":
        return <SubmissionsTab />;

      case "aiAssistant":
        return <AIAssistantTab chat={chat} />;

      default:
        return null;
    }
  };

  return (
    <>
      <div
        className="flex flex-col min-h-0 border border-t-0 border-l-0 2xl:border-l relative min-w-[300px]"
        style={{ width: size }}
        ref={containerRef}
      >
        <button
          {...events}
          ref={buttonRef}
          className="w-4 h-8 bg-(--gray-1) border rounded absolute -right-2 z-10 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing active:bg-(--gray-1)/90 flex items-center justify-center"
        >
          <GripVertical size="0.9rem" />
        </button>

        <div className="flex">
          <TabButton
            value="Description"
            isActive={selectedTab === "description"}
            onClick={() => setSelectedTab("description")}
          />
          <TabButton
            value="Submissions"
            isActive={selectedTab === "submissions"}
            onClick={() => setSelectedTab("submissions")}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-auto">{renderContent()}</div>
        {selectedTab === "submissions" && (
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>
    </>
  );
}

export default LeftSection;
