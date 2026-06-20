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
import { Badge } from "~/components/ui/badge";
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
            className="ring-2 ring-white/60 rounded-full"
            key={creator.id}
            username={creator.display_name}
            src={creator.profile_image ?? undefined}
            textSize="10px"
            size="1.75rem"
          />
        ))}
        {creators.length > MAX_SHOW && (
          <Badge variant="secondary" className="ml-1 text-xs">
            +{creators.length - MAX_SHOW} more
          </Badge>
        )}
      </div>
    );
  };

  if (isFetching) {
    return (
      <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-5 gap-4">
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
          <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-5 gap-4 auto-rows-max">
            {coursePagination.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.data.map((course) => {
                  const { id, name, banner, visibility, instructors } = course;
                  return (
                    <Link
                      key={id}
                      href={visibility === "public" ? `/courses/${id}` : `/sections/${id}`}
                      className="relative rounded-xl overflow-hidden aspect-video border border-(--gray-4) block group"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-(--gray-3) to-(--gray-4)">
                        {banner !== null && (
                          <Image
                            src={banner}
                            alt={`${name} banner`}
                            fill
                            className="group-hover:scale-105 transition-transform object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-white line-clamp-2 flex-1">
                            {name}
                          </h3>
                          {visibility === "public" ? (
                            <span className="inline-flex items-center gap-1 text-xs text-white bg-white/20 px-1.5 py-0.5 rounded shrink-0">
                              <Globe size={10} />
                              Public
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs text-white/80 bg-white/10 px-1.5 py-0.5 rounded shrink-0">
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
