"use client";

import { GripVertical } from "lucide-react";
import SubmissionsTab from "./SubmissionsTab";
import { useState } from "react";
import useDrag from "~/hooks/useDrag";
import { cn } from "~/lib/utils";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import MOCK_DESCRIPTION from "../__mocks__/description.json";

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
  const [selectedTab, setSelectedTab] = useState<"description" | "submissions">(
    "description",
  );

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
          className="w-4 h-8 bg-white border rounded absolute -right-2 z-10 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing active:bg-white/90 flex items-center justify-center"
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
        <div className="flex-1 min-h-0 overflow-auto">
          {selectedTab === "description" ? (
            <SimpleEditor readOnly initialValue={MOCK_DESCRIPTION} />
          ) : (
            <SubmissionsTab />
          )}
        </div>
      </div>
    </>
  );
}

export default LeftSection;
