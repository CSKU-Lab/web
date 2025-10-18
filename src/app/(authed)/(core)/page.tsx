import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "My Courses | CS Lab",
};

export default function Home() {
  return (
    <div className="bg-white h-full">
      <h4 className="text-3xl font-semibold">My Courses</h4>
    </div>
  );
}
