"use client";
import CollapsableSection from "./_components/CollapsableSection";
import DescriptionSection from "./_components/DescriptionSection";
import EditorSection from "./_components/EditorSection";
import { Globe, Trash } from "lucide-react";

function MaterialPage() {
  return (
    <>
      <div className="border-t p-4 mt-4 flex justify-between">
        <div className="flex gap-4">
          <div>
            <h6 className="text-xs text-(--gray-11)">Name</h6>
            <h4 className="font-medium">For loops</h4>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-11)">Tags</h6>
            <h4 className="font-medium">Test</h4>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-11)">Submissions</h6>
            <h4 className="font-medium">126</h4>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-11)">Created By</h6>
            <h4 className="font-medium">SornchaiTheDev</h4>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-11)">Visibility</h6>
            {/* <div className="flex gap-1.5 items-center"> */}
            {/*   <Lock size="0.9rem" /> */}
            {/*   <h4 className="font-medium">Private</h4> */}
            {/* </div> */}
            <div className="flex gap-1.5 items-center">
              <Globe size="0.9rem" />
              <h4 className="font-medium">Public</h4>
            </div>
          </div>
          <div>
            <h6 className="text-xs text-(--gray-11)">Status</h6>
            <div className="flex gap-1.5 items-center">
              <div className="w-2 h-2 rounded-full bg-(--grass-9)"></div>
              <h4 className="font-medium">Saved</h4>
            </div>
            {/* <div className="flex gap-1.5 items-center"> */}
            {/*   <div className="w-2 h-2 rounded-full bg-(--amber-9) animate-pulse"></div> */}
            {/*   <h4 className="font-medium">Saving</h4> */}
            {/* </div> */}
            {/* <div className="flex gap-1.5 items-center"> */}
            {/*   <div className="w-2 h-2 rounded-full bg-(--red-9)"></div> */}
            {/*   <h4 className="font-medium">Failed to save</h4> */}
            {/* </div> */}
            {/* <div className="flex gap-1.5 items-center"> */}
            {/*   <div className="w-2 h-2 rounded-full bg-(--gray-9)"></div> */}
            {/*   <h4 className="font-medium">Offline</h4> */}
            {/* </div> */}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 bg-(--red-9)/10 hover:bg-(--red-9)/20 text-(--red-9) px-3 py-1.5 rounded text-sm transition-colors">
            <Trash size="1rem" />
            Delete
          </button>
        </div>
      </div>
      <div className="flex max-h-140">
        <DescriptionSection />
        <EditorSection />
      </div>
      <div>
        <CollapsableSection name="Test cases" />
        <CollapsableSection name="Config" />
      </div>
    </>
  );
}

export default MaterialPage;
