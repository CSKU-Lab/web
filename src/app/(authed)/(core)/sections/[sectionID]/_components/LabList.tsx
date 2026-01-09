import { CourseItem } from "./CourseItem";

export default function LabList() {
  // const bottomDivRef = useOnElementAppear({
  //   onAppear: () => fetchNextPage(),
  //   enabled: hasNextPage,
  // });
  return (
    <div className="flex flex-col mt-6 gap-4">
      {new Array(10).fill(0).map((_, i) => (
        <CourseItem key={i} id={String(i)}>
          <div className="flex flex-col gap">
            <p className="font-bold">Lab 01</p>
            <p className="text-xs">Due date: 12/12/2025</p>
          </div>
        </CourseItem>
      ))}
    </div>
  );
}
