"use client";
import { Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { Button } from "~/components/commons/Button";
import useResolvePath from "~/hooks/useResolvePath";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import {
  FallbackSectionCard,
  CMSSectionCard,
} from "~/components/commons/SectionCard";
import { Skeleton } from "~/components/ui/skeleton";
import type { IFilter } from "~/types/filter";
import { searchParamsToFilter } from "~/lib/searchparams-to-filter";
import Filters from "~/components/commons/Filters";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import useSectionsByCourseIdPagination from "../_hooks/useSectionsByCoursePagination";

function CourseMainPage() {
  const router = useRouter();
  const { courseID } = useParams();

  const generatePath = useResolvePath();
  const handleOnAddSection = () =>
    router.push(generatePath("/cms/courses/:courseID/sections/new"));

  const filterFields = [
    { display: "Semester Name", value: "name" },
    { display: "Semester Type", value: "type" },
    { display: "Started Date", value: "started_date" },
  ];

  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<IFilter[]>(() =>
    searchParamsToFilter(searchParams, filterFields),
  );

  const {
    data: sectionPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useSectionsByCourseIdPagination({
    course_id: courseID!.toString(),
    args: {
      page_size: 3,
      sort_by: "started_date",
      sort_order: "desc",
      filters,
    },
  });

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <div className="@container px-4">
      <div className="flex justify-end items-center gap-2">
        <Button onClick={handleOnAddSection}>
          <Plus size="1rem" /> Add Section
        </Button>
      </div>

      <Filters fields={filterFields} value={filters} onChange={setFilters} />

      <div className="mt-10 space-y-8">
        {sectionPagination.pages.map((page) =>
          page.data.map((data) => (
            <div key={data.semester.name + data.semester.type}>
              <h6 className="text-xs text-(--gray-10)">Semester</h6>
              <h4 className="text-xl font-semibold text-(--gray-12)">
                {data.semester.name} ({titleFormatter(data.semester.type)})
              </h4>
              <hr className="my-2" />
              <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-5 gap-4 auto-rows-max mt-4">
                {data.sections.map((section) => (
                  <CMSSectionCard
                    key={section.id}
                    id={section.id}
                    name={section.name}
                    instructors={section.instructors.map(
                      (instructor) => instructor.display_name,
                    )}
                    bannerImage={section.banner}
                    semester={data.semester.name}
                  />
                ))}
              </div>
            </div>
          )),
        )}

        {isFetching &&
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index}>
              <h6 className="text-xs text-(--gray-10)">Semester</h6>
              <Skeleton className="w-20 h-6 mt-2" />
              <hr className="my-2" />
              <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-5 gap-4 auto-rows-max mt-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <FallbackSectionCard key={index} />
                ))}
              </div>
            </div>
          ))}
        <div ref={bottomDivRef} className="h-20"></div>
      </div>
    </div>
  );
}

export default CourseMainPage;
