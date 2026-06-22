"use client";

import Link from "next/link";
import type { PublicCourse } from "~/types/public-course";
import usePublicCoursePagination from "~/features/core/courses/hooks/usePublicCoursePagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { Fragment } from "react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import { ServerCrash, Users } from "lucide-react";
import type { IFilter } from "~/types/filter";

interface Props {
  search: string;
}

const PublicCourseList = ({ search }: Props) => {
  const filters: IFilter[] = [];

  const {
    data: coursePagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = usePublicCoursePagination({
    page_size: 12,
    search,
    sort_by: "name",
    sort_order: "asc",
    filters,
  });

  const isNoData =
    coursePagination.pages.every((page) => page.data.length === 0) &&
    !isFetching;

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  if (isFetching) {
    return (
      <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="h-32 rounded-md bg-(--gray-3)" />
            <div className="h-4 w-3/4 bg-(--gray-3)" />
            <div className="h-3 w-1/2 bg-(--gray-3)" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Error
      isError={isError && !isFetching}
      fallback={
        <ErrorFallback
          icon={<ServerCrash size="2rem" />}
          onRetry={refetch}
          title="Cannot load courses"
          message="Please try again later"
        />
      }
    >
      {isNoData ? (
        <NoDataAvailable />
      ) : (
        <>
          <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 gap-4 auto-rows-max">
            {coursePagination.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.data.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2) transition-colors"
                  >
                    <div className="bg-linear-to-bl from-accent to-accent/40 h-5" />
                    <div className="p-4 space-y-3">
                      <h3 className="text-lg font-medium line-clamp-2">
                        {course.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-(--gray-11)">
                        <Users size="1rem" />
                        <span>{course.total_students} students</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {course.creators.slice(0, 3).map((creator) => (
                          <UserProfileImage
                            key={creator.id}
                            className="ring-2 ring-white rounded -ml-1 first:ml-0"
                            username={creator.display_name}
                            src={creator.profile_image ?? undefined}
                            textSize="10px"
                            size="1.5rem"
                          />
                        ))}
                        {course.creators.length > 3 && (
                          <span className="text-xs text-(--gray-11) ml-1">
                            +{course.creators.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </Fragment>
            ))}
          </div>
          <div ref={bottomDivRef} className="h-20" />
        </>
      )}
    </Error>
  );
};

export default PublicCourseList;