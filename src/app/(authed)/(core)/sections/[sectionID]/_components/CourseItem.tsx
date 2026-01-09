"use client";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import useResolvePath from "~/hooks/useResolvePath";

interface CourseItemProps {
  children: React.ReactNode;
  id: string;
}

export const CourseItem = ({ children, id }: CourseItemProps) => {
  const router = useRouter();
  const generatePath = useResolvePath();
  const handleCourseItemClick = (id: string) => {
    router.push(generatePath(`/sections/:sectionID/labs/${id}`));
  };

  return (
    <div className="rounded-lg shadow-md p-4">
      <div className="flex flex-col">
        <div className="flex flex-row gap-2 items-center h-full">
          <Avatar className="h-full aspect-square">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <p>sornchai somsakul - Posted</p>
            <p className="text-xs">04/12/2025</p>
          </div>
        </div>
      </div>
      <hr className="w-full border-1 my-4" />
      <div
        className="flex flex-col hover:cursor-pointer hover:underline"
        onClick={() => handleCourseItemClick(id)}
      >
        {children}
      </div>
    </div>
  );
};
