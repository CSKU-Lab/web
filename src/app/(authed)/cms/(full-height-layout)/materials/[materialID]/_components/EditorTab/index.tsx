import CodeMirror from "~/components/Editor/CodeMirror";
import IOButton from "./IOButton";
import { FilePlus, FolderPlus, GripHorizontal, Play } from "lucide-react";
import useDrag from "~/app/(authed)/(core)/course/[courseId]/lab/hooks/useDrag";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

function EditorSection() {
  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 200,
    direction: "vertical",
  });

  return (
    <>
      <div className="flex-1 min-h-0 flex">
        <div className="min-w-[240px] border-r">
          <div className="flex justify-between items-center mb-3 border-b p-2">
            <h6 className="text-xs">Files</h6>
            <div className="flex gap-3">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-(--gray-11)">
                    <FilePlus size="1rem" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add a file</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-(--gray-11)">
                    <FolderPlus size="1rem" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Add a folder</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="space-y-1.5 px-1">
            <button className="px-4 py-1 flex items-center gap-2 bg-(--gray-4) text-(--gray-12) font-medium rounded text-sm w-full">
              <img
                className="w-6 h-6"
                src="https://go.dev/blog/go-brand/Go-Logo/PNG/Go-Logo_Blue.png"
                alt="test"
              />
              main.go
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">
          <CodeMirror className="h-full" lang="go" vimMode />
        </div>
      </div>
      <div
        className="flex flex-col border-t min-h-20 relative"
        ref={containerRef}
        style={{ height: size }}
      >
        <button
          {...events}
          ref={buttonRef}
          className="w-8 h-4 bg-white border rounded absolute -top-2 z-10 left-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing active:bg-white/90 flex items-center justify-center"
        >
          <GripHorizontal size="0.9rem" />
        </button>
        <div className="border-b p-4">
          <h4 className="text-xs text-(--gray-11)">Playground</h4>
        </div>
        <div className="flex">
          <IOButton isActive>Input</IOButton>
          <IOButton>Output</IOButton>
        </div>
        <div className="flex-1 min-h-10 relative">
          <button className="absolute bottom-2 right-2 z-10 bg-(--gray-12) hover:bg-(--gray-12)/80 text-(--gray-1) p-2 text-xs backdrop-blur-sm transition-colors">
            <Play size="1rem" />
          </button>
          <CodeMirror className="h-full" />
        </div>
      </div>
    </>
  );
}

export default EditorSection;
