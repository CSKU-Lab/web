"use client";
import { Skeleton } from "~/components/ui/skeleton";
import useCoreSection from "../_hooks/useCoreSection";
import SectionBanner from "./SectionBanner";
import { Instructor } from "~/types/core-section";

export default function SectionHeader() {
  const { useGetCourseSectionDetail } = useCoreSection();
  const { data, isLoading } = useGetCourseSectionDetail();

  if (isLoading) {
    return (
      <div className="flex items-center bg-(--gray-1) gap-4 shadow-md relative">
        <div className="absolute top-10 left-6 z-10 flex text-white w-full">
          <div className="space-y-0.5 flex-1 overflow-hidden flex flex-col">
            <Skeleton className="w-2/12 h-[1rem]" />
            <Skeleton className="w-4/12 h-[1.5rem]" />
            <h6 className="font-anuphan text-sm mt-4 truncate">
              <Skeleton className="w-2/12 h-[1rem]" />
            </h6>
          </div>
        </div>
        <SectionBanner />
        <div className="absolute inset-0 bg-black/60" />
      </div>
    );
  }

  return (
    <div className="flex items-center bg-(--gray-1) gap-4 shadow-md relative">
      <div className="absolute top-10 left-6 z-10 flex text-white w-full">
        <div className="space-y-0.5 flex-1 overflow-hidden flex flex-col">
          <h6 className="text-sm">
            {data?.section.name ?? "N/A"} • Fri 14-16 pm
          </h6>
          <h4 className="font-semibold text-2xl line-clamp-2">
            {data?.course.name ?? "N/A"}
          </h4>
          <h6 className="font-anuphan text-sm mt-4 truncate">
            {data?.section.instructors
              .map((inst: Instructor) => inst.display_name)
              .join(", ")}
          </h6>
        </div>
      </div>
      <SectionBanner banner={data?.section.banner} />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}
