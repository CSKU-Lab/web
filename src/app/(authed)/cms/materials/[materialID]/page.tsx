"use client";
import PageTitle from "~/components/commons/PageTitle";
import CodeMirror from "~/components/Editor/CodeMirror";
import IOButton from "./_components/IOButton";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { Button } from "~/components/commons/Button";
import { GripVertical } from "lucide-react";
import useDrag from "~/app/(authed)/(core)/course/[courseId]/lab/hooks/useDrag";

function MaterialPage() {
  const { isDrag, buttonRef, containerRef, size, events } = useDrag({
    initialSize: 500,
    direction: "horizontal",
  });
  return (
    <>
      <PageTitle>Go Routine</PageTitle>

      <div className="flex min-h-0 flex-1 mt-10">
        <div
          className="flex flex-col min-h-0 border border-l-0 4xl:border-l relative min-w-[300px]"
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
          <div className="border-b p-4">
            <h4 className="text-xs text-(--gray-11)">Description</h4>
          </div>
          <div className="flex-1 max-h-full overflow-auto">
            <SimpleEditor />
          </div>
        </div>
        <div className="flex-1 border-l-0 border flex flex-col min-h-0 min-w-[300px]">
          <div className="flex-1 min-h-0 flex flex-col">
            <div className="border-b p-4">
              <h4 className="text-xs text-(--gray-11)">Editor</h4>
            </div>
            <div className="flex-1 max-h-full overflow-auto">
              <CodeMirror className="h-full" />
            </div>
          </div>
          <div className="h-80 flex flex-col border-t min-h-0">
            <div className="flex">
              <IOButton isActive>Input</IOButton>
              <IOButton>Output</IOButton>
            </div>
            <div className="flex-1 min-h-0">
              <CodeMirror className="h-full" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MaterialPage;
