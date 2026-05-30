"use client";
import type { PropsWithChildren } from "react";
import { cn } from "~/lib/tiptap-utils";
import TestcaseTab from "~/features/cms/materials/types/CodeMaterial/components/TestCaseTab";
import ConfigTab from "~/features/cms/materials/types/CodeMaterial/components/ConfigTab";
import { useAtom, useAtomValue } from "jotai";
import { type Tab, tabAtom } from "~/features/cms/materials/types/CodeMaterial/stores/tab.store";
import RunnersTab from "~/features/cms/materials/types/CodeMaterial/components/RunnersTab";
import FilesTab from "~/features/cms/materials/types/CodeMaterial/components/FilesTab";
import SolutionTab from "~/features/cms/materials/types/CodeMaterial/components/SolutionTab";

const TabButton = ({ children }: PropsWithChildren) => {
  const [activeTab, setActiveTab] = useAtom(tabAtom);

  if (typeof children !== "string") {
    throw new Error("TabButton children must be a string");
  }

  const isActive = children === activeTab;

  return (
    <button
      onClick={() => setActiveTab(children as Tab)}
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
  const activeTab = useAtomValue(tabAtom);
  return (
    <div className="flex-1 border-t-0 border-l-0 border flex flex-col min-h-0 min-w-[300px] overflow-hidden">
      <div className="flex flex-col">
        <div className="border-b p-2 flex gap-4">
          <TabButton>Runners</TabButton>
          <TabButton>Files</TabButton>
          <TabButton>Solution</TabButton>
          <TabButton>Test Cases</TabButton>
          <TabButton>Config</TabButton>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
        {activeTab === "Runners" && <RunnersTab />}
        {activeTab === "Files" && <FilesTab />}
        {activeTab === "Solution" && <SolutionTab />}
        {activeTab === "Test Cases" && <TestcaseTab />}
        {activeTab === "Config" && <ConfigTab />}
      </div>
    </div>
  );
}

export default MultipleTabsSection;
