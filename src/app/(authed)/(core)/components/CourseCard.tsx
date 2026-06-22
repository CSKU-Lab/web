"use client";

import Link from "next/link";
import Image from "next/image";
import useMyCourseInfPagination from "~/features/core/home/hooks/useMyCourseInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { Fragment } from "react/jsx-runtime";
import CourseCardSkeleton from "./CourseCardSkeleton";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash, Lock, Globe } from "lucide-react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import type { Creator } from "~/types/core-course";

interface Props {
  search: string;
}

const CourseList = ({ search }: Props) => {
  const {
    data: coursePagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useMyCourseInfPagination({
    page_size: 12,
    search,
  });

  const isNoData =
    coursePagination.pages.every((page) => page.data.length === 0) &&
    !isFetching;

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  const renderCreators = (creators: Creator[]) => {
    const MAX_SHOW = 3;
    return (
      <div className="flex items-center gap-1">
        {creators.slice(0, MAX_SHOW).map((creator) => (
          <UserProfileImage
            className="ring-2 ring-(--gray-1) rounded-full"
            key={creator.id}
            username={creator.display_name}
            src={creator.profile_image ?? undefined}
            textSize="10px"
            size="1.5rem"
          />
        ))}
        {creators.length > MAX_SHOW && (
          <span className="text-xs text-(--gray-11) ml-1">
            +{creators.length - MAX_SHOW}
          </span>
        )}
      </div>
    );
  };

  if (isFetching) {
    return (
      <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
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
          title="Cannot get the courses"
          message="There was an error to get the courses. Please try again later or report issue"
        />
      }
    >
      {isNoData ? (
        <NoDataAvailable />
      ) : (
        <>
          <div className="grid grid-cols-1 @lg:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4 @6xl:grid-cols-5 gap-4 auto-rows-max">
            {coursePagination.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.data.map((course) => {
                  const { id, name, banner, visibility, instructors } = course;
                  return (
                    <Link
                      key={id}
                      href={visibility === "public" ? `/courses/${id}` : `/sections/${id}`}
                      className="rounded-xl overflow-hidden border border-(--gray-4) bg-(--gray-1) hover:bg-(--gray-2) transition-colors block group"
                    >
                      <div className="relative aspect-video w-full bg-linear-to-br from-(--gray-3) to-(--gray-4) overflow-hidden">
                        {banner !== null && (
                          <Image
                            src={banner}
                            alt={`${name} banner`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        )}
                      </div>
                      <div className="p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                            {name}
                          </h3>
                          {visibility === "public" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-(--gray-11) shrink-0 mt-0.5">
                              <Globe size={10} />
                              Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-(--gray-11) shrink-0 mt-0.5">
                              <Lock size={10} />
                              Private
                            </span>
                          )}
                        </div>
                        {renderCreators(instructors)}
                      </div>
                    </Link>
                  );
                })}
              </Fragment>
            ))}
          </div>
          <div ref={bottomDivRef} className="h-20" />
        </>
      )}
    </Error>
  );
};

export default CourseList;
