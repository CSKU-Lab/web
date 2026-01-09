import { type Metadata } from "next";
import CourseCard from "./components/CourseCard";

export const metadata: Metadata = {
  title: "My Courses | CS Lab",
};

export default function Home() {
  // const bottomDivRef = useOnElementAppear({
  //   onAppear: () => fetchNextPage(),
  //   enabled: hasNextPage,
  // });
  return (
    <div className="bg-white h-full p-4 gap-10 flex flex-col">
      <h4 className="text-3xl font-semibold">My Courses</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {new Array(10).fill(0).map((_, i) => (
          <CourseCard key={i} id={String(i)} />
        ))}
      </div>
    </div>
  );
}
