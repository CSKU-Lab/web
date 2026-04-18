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
      <div className="px-4 lg:px-12 py-4">
        <div className="relative">
          <SectionBanner />
          <div className="absolute bottom-4 left-6 z-10">
            <div className="bg-white dark:bg-(--gray-2) rounded-lg shadow p-4">
              <div className="flex flex-col gap-1">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-48 h-6" />
                <Skeleton className="w-32 h-4 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <SectionBanner banner={data?.section.banner} />
      <div className="absolute bottom-6 left-6 z-10">
        <div className="bg-white dark:bg-(--gray-2) rounded-lg shadow p-4">
          <div className="flex flex-col gap-1">
            <h6 className="text-sm text-(--gray-10)">
              {data?.section.name ?? "N/A"}
            </h6>
            <h4 className="font-semibold text-2xl text-(--gray-12) line-clamp-2">
              {data?.course.name ?? "N/A"}
            </h4>
            <h6 className="font-anuphan text-sm text-(--gray-10) truncate">
              {data?.section.instructors
                .map((inst: Instructor) => inst.display_name)
                .join(", ")}
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
}
