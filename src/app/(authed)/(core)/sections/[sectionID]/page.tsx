import { type Metadata } from "next";
import { timeout } from "~/lib/timeout";
import LabList from "./_components/LabList";
import SectionHeader from "./_components/SectionHeader";

export const generateMetadata = async (props: {
  params: Promise<{ sectionID: string }>;
}): Promise<Metadata> => {
  const params = await props.params;
  const courses = [
    { name: "Fundamental Computing Concepts", id: "0" },
    { name: "Fundamental Programming", id: "1" },
  ];

  const course = courses.find((course) => course.id === params.sectionID);
  await timeout(1000);

  return {
    title: `${course?.name} | CS Lab`,
  };
};

async function MainCoursePage() {
  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <SectionHeader />
      <div className="px-4 lg:px-12 py-4">
        <h4 className="font-semibold text-2xl">Labs</h4>
        <LabList />
      </div>
    </div>
  );
}

export default MainCoursePage;
