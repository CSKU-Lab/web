"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { queryKeys } from "~/queryKeys";
import { cmsCourseService } from "~/services/cms-course.service";
import { Skeleton } from "~/components/ui/skeleton";
import { PreviewCMSSectionCard } from "~/components/commons/SectionCard";
import { titleFormatter } from "~/lib/formatters/titleFormatter";

interface Props {
  courseId: string;
  courseName: string;
}

// Pull just the first page of sections per course — the overview is a glance,
// not the full directory. "View course" links through for the complete list.
const PAGE_SIZE = 8;

function CourseSectionsBlock({ courseId, courseName }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.course.sections(courseId),
    queryFn: () =>
      cmsCourseService.getSectionsByCourseIDPagination(courseId, {
        page: 1,
        page_size: PAGE_SIZE,
        search: "",
        sort_by: "started_date",
        sort_order: "desc",
      }),
  });

  const semesterGroups = data?.data ?? [];

  // Hide courses with no sections — the overview only surfaces courses the
  // instructor can actually jump into.
  if (!isLoading && semesterGroups.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-lg font-medium text-(--gray-12)">{courseName}</h3>
        <Link
          href={`/cms/courses/${courseId}`}
          className="flex shrink-0 items-center gap-1 text-xs text-(--gray-10) hover:text-(--gray-12) transition-colors"
        >
          View course
          <ArrowRight size="0.875rem" />
        </Link>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
      )}

      {semesterGroups.map((group) => (
        <div key={group.semester.name + group.semester.type} className="space-y-3">
          <h4 className="text-xs font-medium text-(--gray-10)">
            {group.semester.name} · {titleFormatter(group.semester.type)}
          </h4>
          <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 gap-3">
            {group.sections.map((section) => (
              <Link
                key={section.id}
                href={`/cms/courses/${courseId}/sections/${section.id}`}
                className="block"
              >
                <PreviewCMSSectionCard
                  name={section.name}
                  semester={group.semester.name}
                  bannerImage={section.banner}
                  instructors={section.instructors.map((i) => i.display_name)}
                  className="hover:border-(--gray-6) transition-colors"
                />
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export default CourseSectionsBlock;
