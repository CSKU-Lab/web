"use client";

import Link from "next/link";
import useCoreSectionInfPagination from "../_hooks/useCoreSectionInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { Fragment } from "react/jsx-runtime";
import CourseCardSkeleton from "./CourseCardSkeleton";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash } from "lucide-react";
import type { IFilter } from "~/types/filter";
import UserProfileImage from "~/components/Menus/UserProfileImage";
import { Badge } from "~/components/ui/badge";

type StatusFilter = "active" | "archived" | "all";

interface Props {
  search: string;
  status: StatusFilter;
}

const CourseList = ({ search, status }: Props) => {
  const filters: IFilter[] = [];

  if (status !== "all") {
    const archiveValue = status === "active" ? "false" : "true";
    filters.push({
      field: { display: "Is Archived", value: "is_archived" },
      operator: "is",
      value: archiveValue,
      status: "newly-created",
    });
  }

  const {
    data: sectionPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useCoreSectionInfPagination({
    page_size: 12,
    search,
    sort_by: "created_at",
    sort_order: "desc",
    filters,
  });

  const isNoData =
    sectionPagination.pages.every((page) => page.data.length === 0) &&
    !isFetching;

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  const renderInstructors = (instructors: { id: string; display_name: string; profile_image: string | null }[]) => {
    const MAX_SHOW_INSTRUCTORS = 3;
    return (
      <div className="flex items-center gap-1 mt-2">
        {instructors.slice(0, MAX_SHOW_INSTRUCTORS).map((instructor) => (
          <UserProfileImage
            className="ring-2 ring-white rounded"
            key={instructor.id}
            username={instructor.display_name}
            src={instructor.profile_image ?? undefined}
            textSize="10px"
            size="1.75rem"
          />
        ))}
        {instructors.length > MAX_SHOW_INSTRUCTORS && (
          <Badge variant="secondary" className="ml-1 text-xs">
            +{instructors.length - MAX_SHOW_INSTRUCTORS} more
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
              {sectionPagination.pages.map((page, pageIndex) => (
                <Fragment key={pageIndex}>
                  {page.data.map((section) => {
                    const { id, name, course_name, semester, instructors } = section;
                    return (
                      <Link
                        key={id}
                        href={`/sections/${id}`}
                        className="block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) hover:bg-(--gray-2)"
                      >
                        <div className="bg-linear-to-bl from-accent to-accent/40 h-5"></div>
                        <div className="p-4 space-y-2 flex-1">
                          <div>
                            <h6 className="text-xs leading-tight text-(--gray-11)">
                              Course
                            </h6>
                            <h3 className="text-lg font-medium line-clamp-2">
                              {course_name}
                            </h3>
                          </div>
                          <div>
                            <h6 className="text-xs leading-tight text-(--gray-11)">
                              Section
                            </h6>
                            <p className="text-sm">{name}</p>
                          </div>
                          <div>
                            <h6 className="text-xs leading-tight text-(--gray-11)">
                              Semester
                            </h6>
                            <p className="text-sm">
                              {semester.name} {semester.type}
                            </p>
                          </div>
                          <div>
                            <h6 className="text-xs leading-tight text-(--gray-11)">
                              Instructors
                            </h6>
                            {renderInstructors(instructors)}
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
