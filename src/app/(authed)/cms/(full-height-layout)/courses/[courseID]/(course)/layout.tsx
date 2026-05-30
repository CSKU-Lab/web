"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import RouteNavigation from "~/features/cms/courses/components/RouteNavigation";

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const segments = useSelectedLayoutSegments();
  // segments has length > 1 when on a detail page (e.g. labs/[labID])
  const isTabPage = segments.length <= 1;

  return (
    <>
      {isTabPage && <RouteNavigation />}
      {children}
    </>
  );
}
