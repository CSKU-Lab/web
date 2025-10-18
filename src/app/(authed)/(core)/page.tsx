import { type Metadata } from "next";
import SectionCard from "../../../components/commons/SectionCard";

export const metadata: Metadata = {
  title: "My Courses | CS Lab",
};

export default function Home() {
  return (
    <div className="p-4 lg:px-12 bg-white h-full">
      <h4 className="text-3xl font-semibold">My Courses</h4>

      <div className="mt-8 grid grid-cols-12 gap-8">
        {Array.from({ length: 1 }).map((_, i) => (
          <SectionCard key={i} />
        ))}
      </div>
    </div>
  );
}
