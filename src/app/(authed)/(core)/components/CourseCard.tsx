"use client";

import Link from "next/link";
import Image from "next/image";
import useMyCourseInfPagination from "~/features/core/home/hooks/useMyCourseInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { Fragment } from "react/jsx-runtime";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash } from "lucide-react";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { Skeleton } from "~/components/ui/skeleton";
import type { Creator, MyCourse } from "~/types/core-course";

interface Props {
  search: string;
}

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
          textSize="9px"
          size="1.375rem"
        />
      ))}
      {creators.length > MAX_SHOW && (
        <span className="text-xs text-(--gray-10) ml-0.5">
          +{creators.length - MAX_SHOW}
        </span>
      )}
    </div>
  );
};

const CourseCardItem = ({ course }: { course: MyCourse }) => {
  const { id, name, banner, visibility, instructors, section_name, semester } = course;
  const isPrivate = visibility === "private";

  return (
    <Link
      href={isPrivate ? `/sections/${id}` : `/courses/${id}`}
      className="rounded-xl overflow-hidden border border-(--gray-5) bg-(--gray-1) hover:border-(--gray-7) hover:shadow-lg shadow-black/10 transition-all duration-200 block group"
    >
      {/* Banner strip */}
      <div className="relative h-28 w-full overflow-hidden">
        {banner ? (
          <>
            <Image
              src={banner}
              alt={`${name} banner`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                isPrivate
                  ? "from-grass-9/30 to-transparent"
                  : "from-blue-9/30 to-transparent"
              }`}
            />
          </>
        ) : (
          <div
            className={`h-full w-full flex items-end justify-end p-3 ${
              isPrivate
                ? "bg-linear-to-br from-(--grass-3) to-(--grass-5)"
                : "bg-linear-to-br from-(--blue-3) to-(--blue-5)"
            }`}
          >
            <span
              className={`text-5xl font-black leading-none select-none ${
                isPrivate ? "text-(--grass-7)" : "text-(--blue-7)"
              }`}
            >
              {name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        )}

        {/* Semester type tag — top right */}
        {semester && (
          <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wider text-white/90 bg-black/35 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {semester.name} · {semester.type}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1.5">
        <div>
          <h3 className="font-semibold text-sm leading-snug line-clamp-1 text-(--gray-12)">
            {name}
          </h3>
          {isPrivate && section_name && (
            <p className="text-xs text-(--gray-11) truncate mt-0.5">{section_name}</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-0.5">
          {renderCreators(instructors)}
        </div>
      </div>
    </Link>
  );
};

const CourseCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden border border-(--gray-5) bg-(--gray-1)">
    <Skeleton className="h-28 w-full" />
    <div className="p-3 space-y-2">
      <Skeleton className="h-3.5 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-1 pt-0.5">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
    </div>
  </div>
);

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
                {page.data.map((course) => (
                  <CourseCardItem key={course.id} course={course} />
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

export default CourseList;
