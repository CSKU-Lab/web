"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import { useSession } from "~/providers/SessionProvider";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import useCoursePagination from "~/features/cms/courses/hooks/useCoursePagination";
import useCMSOverview from "~/features/cms/analytics/hooks/useCMSOverview";
import CourseSectionsBlock from "./CourseSectionsBlock";
import OverviewStats from "./OverviewStats";

const STATS_RANGE_DAYS = 30;

const SUBTITLES = [
  "A glance at the platform, then jump into your courses.",
  "Here's how things are looking today.",
  "Your courses are waiting. Let's get to it.",
  "The numbers up top, your work down below.",
  "Ready when you are.",
  "Another day, another batch of submissions.",
  "Pick up where you left off.",
  "Everything you teach, in one place.",
];

function OverviewView() {
  const { user } = useSession();
  const firstName = user.displayName?.split(" ")[0] ?? "there";

  // Empty on the server and first client render (so they match — no hydration
  // mismatch), then pick a random subtitle once mounted on the client.
  const [subtitle, setSubtitle] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only random reveal after hydration
    setSubtitle(SUBTITLES[Math.floor(Math.random() * SUBTITLES.length)]);
  }, []);

  const { data: overview, isLoading: isStatsLoading } =
    useCMSOverview(STATS_RANGE_DAYS);

  const {
    data: coursePagination,
    isFetching: isCoursesFetching,
    fetchNextPage,
    hasNextPage,
  } = useCoursePagination({
    page_size: 12,
    search: "",
    sort_by: "name",
    sort_order: "asc",
    show: "all",
  });

  const courses = coursePagination.pages.flatMap((page) => page.data);
  const isCoursesEmpty = courses.length === 0 && !isCoursesFetching;

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pt-16 pb-24">
        <header className="space-y-1">
          <h5 className="text-2xl font-medium text-(--gray-12)">
            Welcome back, {firstName}
          </h5>
          <p className="text-sm text-(--gray-10)">{subtitle}</p>
        </header>

        <section>
          {isStatsLoading && !overview ? (
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-28" />
              ))}
            </div>
          ) : (
            overview && <OverviewStats summary={overview.summary} />
          )}
        </section>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-(--gray-11)">My courses</h2>
          <hr className="border-(--gray-4)" />
        </div>

        <div className="@container flex flex-col gap-12">
        {isCoursesEmpty && (
          <p className="text-sm text-(--gray-10)">
            You don&apos;t have any courses yet.
          </p>
        )}

        {courses.map((course) => (
          <CourseSectionsBlock
            key={course.id}
            courseId={course.id}
            courseName={course.name}
          />
        ))}

        {isCoursesFetching &&
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="aspect-video rounded-xl" />
                ))}
              </div>
            </div>
          ))}

          <div ref={bottomDivRef} className="h-10" />
        </div>
      </div>
    </div>
  );
}

export default OverviewView;
