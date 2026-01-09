import { type Metadata } from "next";
import { timeout } from "~/lib/timeout";
import { myCourses } from "~/__mocks__/myCourses";
import LabList from "./_components/LabList";

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

async function MainCoursePage(props: {
  params: Promise<{ sectionID: string }>;
}) {
  const params = await props.params;
  const { sectionID } = params;
  const currentCourse = myCourses[0];
  const { labs } = currentCourse;
  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <div className="flex items-center bg-white gap-4 shadow-md relative">
        <div className="absolute top-10 left-6 z-10 flex text-white w-full">
          <div className="space-y-0.5 flex-1 overflow-hidden flex flex-col">
            <h6 className="text-sm">Sec 12 • Fri 14-16 pm</h6>
            <h4 className="font-semibold text-2xl line-clamp-2">
              Fundamental Computing Concepts dawlkdjwaklj dklawdj klawdjlk wajd
              lkawjldkwajldk awddk lawjdwlkajdlka jdlkwajldawjlk
            </h4>
            <h6 className="font-anuphan text-sm mt-4 truncate">
              อ.ศรชัย ลักษณะปิติ
            </h6>
          </div>
        </div>
        <div className="w-full h-[20rem] overflow-hidden">
          <img
            src="https://cdn.shadcnstudio.com/ss-assets/components/card/image-2.png?height=280&format=auto"
            alt="Banner"
            className="aspect-video w-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />
      </div>
      <div className="px-4 lg:px-12 py-4">
        <h4 className="font-semibold text-2xl">Labs</h4>
        <LabList />
      </div>
    </div>
  );
}

export default MainCoursePage;
