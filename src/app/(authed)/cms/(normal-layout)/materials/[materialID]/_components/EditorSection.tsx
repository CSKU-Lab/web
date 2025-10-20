import CodeMirror from "~/components/Editor/CodeMirror";
import IOButton from "./IOButton";
import { GripHorizontal, Play } from "lucide-react";
import useDrag from "~/app/(authed)/(core)/course/[courseId]/lab/hooks/useDrag";

function EditorSection() {
  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 200,
    direction: "vertical",
  });

  return (
    <div className="flex-1 border-l-0 border flex flex-col min-h-0 min-w-[300px] overflow-hidden">
      <div className="flex-1 min-h-20 flex flex-col">
        <div className="border-b p-4">
          <h4 className="text-xs text-(--gray-11)">Editor</h4>
        </div>
        <div className="flex-1 max-h-full overflow-auto">
          <CodeMirror className="h-full" lang="go" vimMode />
        </div>
      </div>
      <div
        className="flex flex-col border-t min-h-0 relative"
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
        <div className="flex-1 min-h-0 relative">
          <button className="absolute bottom-2 right-2 z-10 bg-(--gray-12) hover:bg-(--gray-12)/80 text-(--gray-1) p-2 text-xs backdrop-blur-sm transition-colors">
            <Play size="1rem" />
          </button>
          <CodeMirror className="h-full" />
        </div>
      </div>
    </div>
  );
}

export default EditorSection;
