"use client";
import { GripVertical } from "lucide-react";
import useDrag from "~/hooks/useDrag";
import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import { useMaterial } from "../_providers/MaterialProvider";

function DescriptionSection() {
  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 500,
    direction: "horizontal",
  });

  const { description, onChangeDescription } = useMaterial();
  return (
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
      <div className="border-b p-4">
        <h4 className="text-xs text-(--gray-11)">Description</h4>
      </div>
      <div className="flex-1 max-h-full overflow-auto">
        <SimpleEditor
          initialValue={description}
          onChange={onChangeDescription}
        />
      </div>
    </div>
  );
}

export default DescriptionSection;
