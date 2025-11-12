"use client";

import { NotebookText, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import useDrag from "../../../../../../../hooks/useDrag";
import { cn } from "~/lib/utils";

import SubmissionsTab from "./SubmissionsTab";
import { type ReactNode, type RefObject } from "react";

interface Props {
  descriptionTab: ReactNode;
}

function LeftSection({ descriptionTab }: Props) {
  const { isDrag, size, containerRef, buttonRef, events } = useDrag({});

  return (
    <>
      <div
        className="border border-(--gray-6) rounded-lg h-full bg-white"
        style={{ width: size, minWidth: 300 }}
        ref={containerRef}
      >
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
      <HorizontalSectionControl {...{ buttonRef, events, isDrag }} />
    </>
  );
}

export default LeftSection;

const HorizontalSectionControl = ({
  buttonRef,
  events,
  isDrag,
}: {
  buttonRef: RefObject<HTMLButtonElement | null>;
  events: {
    onMouseDown: () => void;
    onDoubleClick: () => void;
  };
  isDrag: boolean;
}) => {
  return (
    <button
      className="flex items-center h-full mx-1 cursor-ew-resize"
      ref={buttonRef}
      {...events}
    >
      <div
        className={cn(
          "w-1 h-12 bg-(--gray-6) rounded-full hover:h-14 transition-all",
          isDrag && "h-16",
        )}
      ></div>
    </button>
  );
};
