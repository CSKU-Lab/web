"use client";
import { useRouter } from "next/navigation";
import useResolvePath from "~/hooks/useResolvePath";
import { CircleCheck, CircleX, CirclePlay } from "lucide-react";
import { LabItemSkeleton } from "./LabItemSkeleton";

interface LabItemProps {
  children: React.ReactNode;
  id: string;
  name: string;
}
export const LabItem = ({ children, id, name }: LabItemProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();
  const handleCourseItemClick = (id: string) => {
    router.push(generatePath(`/sections/:sectionID/labs/${id}`));
  };

  const statusColorMap = {
    passed: (
      <div className="text-green-500 flex items-center gap-2">
        <CircleCheck />
      </div>
    ),
    not_passed: (
      <div className="text-red-500 flex items-center gap-2">
        <CircleX />
      </div>
    ),
    in_progress: (
      <div className="text-yellow-500 flex items-center gap-2">
        <CirclePlay />
      </div>
    ),
  };

  return (
    <div
      className="rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer transition-shadow duration-200"
      onClick={() => handleCourseItemClick(id)}
    >
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center h-full">
          <div className="flex flex-row justify-between w-full items-center">
            <p className="font-bold">{name}</p>
            {statusColorMap["in_progress"]}
          </div>
        </div>
      </div>
      <hr className="w-full border-1 my-4" />
      <div className="flex flex-col ">{children}</div>
    </div>
  );
};
