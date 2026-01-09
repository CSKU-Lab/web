"use client";

import { NotebookText, History, GripVertical } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import SubmissionsTab from "./SubmissionsTab";
import { type ReactNode, type RefObject } from "react";
import useDrag from "~/hooks/useDrag";

interface Props {
  descriptionTab: ReactNode;
}

function LeftSection({ descriptionTab }: Props) {
  const { buttonRef, containerRef, size, events } = useDrag({
    initialSize: 500,
    direction: "horizontal",
  });

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
        <Tabs
          defaultValue="description"
          className="h-full flex flex-col justify-start items-start"
        >
          <div className="p-4">
            <TabsList>
              <TabsTrigger
                value="description"
                className="flex gap-2 items-center"
              >
                <NotebookText size="1.25rem" />
                Description
              </TabsTrigger>
              <TabsTrigger value="submissions">
                <History size="1.25rem" />
                Submissions
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value="description"
            className="px-4 py-2 overflow-y-auto w-full"
          >
            {descriptionTab}
          </TabsContent>
          <TabsContent
            value="submissions"
            className="w-full p-4 overflow-y-auto"
          >
            <SubmissionsTab />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default LeftSection;
