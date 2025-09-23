"use client";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "~/components/commons/Button";
import SearchInput from "~/components/commons/SearchInput";
import SectionCard from "~/components/commons/SectionCard";
import useResolvePath from "~/hooks/useResolvePath";

function CourseMainPage() {
  const [search, setSearch] = React.useState("");
  const router = useRouter();

  const generatePath = useResolvePath();
  const handleOnAddSection = () =>
    router.push(generatePath("/cms/courses/:courseID/sections/new"));

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

      <div className="mt-10">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="mb-8">
            <h6 className="text-xs text-(--gray-10)">Semester</h6>
            <h4 className="text-xl font-semibold text-(--gray-12)">
              2568/{index + 1}
            </h4>
            <hr className="my-2" />
            <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-5 gap-4 auto-rows-max mt-4">
              <SectionCard />
              <SectionCard />
              <SectionCard />
              <SectionCard />
              <SectionCard />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseMainPage;
