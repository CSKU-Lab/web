import type { PropsWithChildren } from "react";
import { type Tab, useMaterial } from "../_providers/MaterialProvider";
import { cn } from "~/lib/tiptap-utils";
import EditorTab from "./EditorTab";

const TabButton = ({ children }: PropsWithChildren) => {
  const { activeTab, onChangeTab } = useMaterial();

  if (typeof children !== "string") {
    throw new Error("TabButton children must be a string");
  }

  const isActive = children === activeTab;

  return (
    <button
      onClick={() => onChangeTab(children as Tab)}
      className={cn(
        "text-xs px-4 py-2 rounded",
        isActive && "text-(--gray-1) bg-(--gray-12)",
        !isActive &&
          "text-(--gray-11) hover:bg-(--gray-3) hover:text-(--gray-12)",
      )}
    >
      {children}
    </button>
  );
};
function MultipleTabsSection() {
  const { activeTab } = useMaterial();
  return (
    <div className="flex-1 border-t-0 border-l-0 border flex flex-col min-h-0 min-w-[300px] overflow-hidden">
      <div className="flex flex-col">
        <div className="border-b p-2 flex gap-4">
          <TabButton>Editor</TabButton>
          <TabButton>Test Cases</TabButton>
          <TabButton>Config</TabButton>
        </div>
      </div>
      {activeTab === "Editor" && <EditorTab />}
    </div>
  );
}

export default MultipleTabsSection;
