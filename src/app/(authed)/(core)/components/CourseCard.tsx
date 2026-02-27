"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InstructorAvatars } from "./InstructorAvatars";
import CardOptions from "./CardOptions";
import { notFound, useRouter } from "next/navigation";
import useCoreSectionInfPagination from "../_hooks/useCoreSectionInfPagination";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import { Fragment } from "react/jsx-runtime";
import Image from "next/image";
import CourseCardSkeleton from "./CourseCardSkeleton";
import NoDataAvailable from "~/components/commons/NoDataAvailable";
import ErrorFallback from "~/components/commons/Error/ErrorFallback";
import Error from "~/components/commons/Error";
import { ServerCrash } from "lucide-react";

const CourseList = () => {
  const router = useRouter();
  const handleCardClick = (id: string) => {
    router.push(`/sections/${id}`);
  };

  const {
    data: sectionPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
    refetch,
  } = useCoreSectionInfPagination({
    page_size: 5,
    sort_by: "created_at",
    sort_order: "desc",
    filters: [],
  });

  const isNoData =
    sectionPagination.pages.every((page) => page.data.length === 0) &&
    !isFetching;

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  if (isFetching) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="flex flex-col flex-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sectionPagination.pages.map((page, pageIndex) => (
              <Fragment key={pageIndex}>
                {page.data.map((section) => {
                  const { id, banner, name, semester, instructors } = section;
                  return (
                    <Card
                      key={id}
                      className="pt-0 w-full flex flex-col hover:cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
                      onClick={() => handleCardClick(id)}
                    >
                      <CardContent className="px-0 h-40 relative overflow-hidden rounded-t-xl">
                        {banner ? (
                          <Image
                            fill
                            src={banner}
                            alt="Banner"
                            className="aspect-video w-full object-cover scale-105"
                          />
                        ) : (
                          <div className="aspect-video w-full object-cover scale-105 bg-linear-to-br from-(--gray-3) to-(--gray-4)"></div>
                        )}
                      </CardContent>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between gap-2 min-w-0">
                          <p className="min-w-0 break-words line-clamp-2">
                            {name}
                          </p>
                          <div
                            className="
                        w-8 h-8 rounded-full
                        flex items-center justify-center
                        hover:bg-[var(--gray-2)]
                        transition-colors duration-200 ease-in-out
                        cursor-pointer
                      "
                          >
                            <CardOptions sectionID={id} />
                          </div>
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-3"></CardDescription>
                      </CardHeader>

                      <div className="flex items-center gap-2 w-full">
                        <hr className="w-3/12" />
                        <p className="text-sm">Instructors</p>
                        <hr className="w-full" />
                      </div>
                      <CardFooter className="flex flex-col">
                        <div className="flex justify-end w-full">
                          <InstructorAvatars instructors={instructors} />
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </Fragment>
            ))}
          </div>
        )}
      </Error>
      <div ref={bottomDivRef} className="h-20"></div>
    </div>
  );
};

export default CourseList;
