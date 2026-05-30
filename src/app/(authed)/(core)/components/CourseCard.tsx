"use client";

import Link from "next/link";
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
      <div className="flex items-center gap-1 mt-2">
        {creators.slice(0, MAX_SHOW).map((creator) => (
          <UserProfileImage
            className="ring-2 ring-white rounded"
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
      <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4 auto-rows-max">
            {coursePagination.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.data.map((course) => {
                  const { id, name, description, visibility, total_students, instructors } = course;
                  return (
                    <Link
                      key={id}
                      href={visibility === "public" ? `/courses/${id}` : `/sections/${id}`}
                      className="block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2)"
                    >
                      <div className="bg-linear-to-bl from-accent to-accent/40 h-5"></div>
                      <div className="p-4 space-y-2 flex-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-medium line-clamp-2 flex-1">
                              {name}
                            </h3>
                            {visibility === "public" ? (
                              <span className="inline-flex items-center gap-1 text-xs text-(--blue-11) bg-(--blue-3) px-1.5 py-0.5 rounded shrink-0">
                                <Globe size={10} />
                                Public
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-(--gray-11) bg-(--gray-3) px-1.5 py-0.5 rounded shrink-0">
                                <Lock size={10} />
                                Private
                              </span>
                            )}
                          </div>
                          {description && (
                            <p className="text-sm text-(--gray-11) line-clamp-2 mt-1">
                              {description}
                            </p>
                          )}
                        </div>
                        <div>
                          <h6 className="text-xs leading-tight text-(--gray-11)">
                            Students
                          </h6>
                          <p className="text-sm">{total_students}</p>
                        </div>
                        <div>
                          <h6 className="text-xs leading-tight text-(--gray-11)">
                            Instructors
                          </h6>
                          {renderCreators(instructors)}
                        </div>
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
