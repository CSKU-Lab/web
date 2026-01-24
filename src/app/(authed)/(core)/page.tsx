import { type Metadata } from "next";
import CourseCard from "./components/CourseCard";
import useCoreSectionPagination from "./_hooks/useCoreSectionInfPagination";
import CourseList from "./components/CourseCard";

export const metadata: Metadata = {
  title: "My Courses | CS Lab",
};

export default function Home() {
  return (
    <div className="bg-white h-full p-4 gap-10 flex flex-col">
      <h4 className="text-3xl font-semibold">My Courses</h4>
      <CourseList />
    </div>
  );
}
