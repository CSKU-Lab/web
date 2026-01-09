"use client";
import EditorTab from "~/app/(authed)/cms/(full-height-layout)/materials/[materialID]/_materialTypes/CodeMaterial/_components/EditorTab";
import CodeHeader from "~/components/Editor/CodeHeader";

function RightSection() {
  return (
    <div className="flex-1 border-t-0 border-l-0 border flex flex-col min-h-0 min-w-[300px] overflow-hidden">
      <div className="flex flex-col">
        <CodeHeader />
      </div>
      <div className="flex-1 min-h-0 overflow-auto flex flex-col">
        <EditorTab />
      </div>
    </div>
  );
}

export default RightSection;
