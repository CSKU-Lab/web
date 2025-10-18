"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/commons/Button";
import SearchInput from "~/components/commons/SearchInput";
import useResolvePath from "~/hooks/useResolvePath";
import useSectionPagination from "./_hooks/useSectionPagination";
import useInputDebounce from "~/hooks/useInputDebounce";
import useOnElementAppear from "~/hooks/useOnElementAppear";
import {
  FallbackSectionCard,
  SectionCard,
} from "~/components/commons/SectionCard";
import { Skeleton } from "~/components/ui/skeleton";

function CourseMainPage() {
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const debouncedSearch = useInputDebounce(search, 1000);

  const generatePath = useResolvePath();
  const handleOnAddSection = () =>
    router.push(generatePath("/cms/courses/:courseID/sections/new"));

  const {
    data: sectionPagination,
    fetchNextPage,
    hasNextPage,
    isFetching,
  } = useSectionPagination({
    page_size: 3,
    search: debouncedSearch,
    sort_by: "started_date",
    sort_order: "desc",
  });

  const bottomDivRef = useOnElementAppear({
    onAppear: () => fetchNextPage(),
    enabled: hasNextPage,
  });

  return (
    <div className="@container">
      <div className="flex justify-end items-center gap-2">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search sections..."
        />
        <Button onClick={handleOnAddSection}>
          <Plus size="1rem" /> Add Section
        </Button>
      </div>

      <div className="mt-10 space-y-8">
        {sectionPagination.pages.map((page) =>
          page.data.map((data) => (
            <div key={data.semester.name + data.semester.type}>
              <h6 className="text-xs text-(--gray-10)">Semester</h6>
              <h4 className="text-xl font-semibold text-(--gray-12)">
                {data.semester.name} ({data.semester.type})
              </h4>
              <hr className="my-2" />
              <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-5 gap-4 auto-rows-max mt-4">
                {data.sections.map((section) => (
                  <SectionCard
                    key={section.id}
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
