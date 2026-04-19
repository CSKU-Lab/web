"use client";

import { useState } from "react";
import Link from "next/link";
import SearchInput from "~/components/commons/SearchInput";
import useInputDebounce from "~/hooks/useInputDebounce";
import CourseList from "./components/CourseCard";
import FeaturedCourses from "./components/FeaturedCourses";
import { ArrowRight } from "lucide-react";

function Home() {
  const [search, setSearch] = useState("");

  const debouncedSearch = useInputDebounce(search, 1000);

  return (
    <div className="@container bg-(--gray-1) h-full p-4 gap-6 flex flex-col w-full">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-semibold">Featured Courses</h5>
          <Link
            href="/courses"
            className="flex items-center gap-1 text-sm text-(--gray-11) hover:text-(--gray-12) transition-colors"
          >
            View all <ArrowRight size="1rem" />
          </Link>
        </div>
        <FeaturedCourses />
      </section>

      <div className="flex justify-between items-center gap-4">
        <h4 className="text-3xl font-semibold">My Courses</h4>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search courses..."
          className=""
        />
      </div>
      <CourseList search={debouncedSearch} />
    </div>
  );
}

export default Home;
