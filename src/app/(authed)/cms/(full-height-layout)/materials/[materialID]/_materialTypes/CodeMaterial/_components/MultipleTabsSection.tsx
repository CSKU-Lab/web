"use client";
import type { PropsWithChildren } from "react";
import { cn } from "~/lib/tiptap-utils";
import EditorTab from "./EditorTab";
import TestcaseTab from "./TestCaseTab";
import ConfigTab from "./ConfigTab";
import { useAtom, useAtomValue } from "jotai";
import { type Tab, tabAtom } from "../_stores/tab.store";

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
          <TabButton>Editor</TabButton>
          <TabButton>Test Cases</TabButton>
          <TabButton>Config</TabButton>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        {activeTab === "Editor" && <EditorTab />}
        {activeTab === "Test Cases" && <TestcaseTab />}
        {activeTab === "Config" && <ConfigTab />}
      </div>
    </div>
  );
}

export default MultipleTabsSection;
