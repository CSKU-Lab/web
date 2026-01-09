"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { InstructorAvatars } from "./InstructorAvatars";
import CardOptions from "./CardOptions";
import { useRouter } from "next/navigation";

interface CourseCardProps {
  id: string;
}

const CourseCard = ({ id }: CourseCardProps) => {
  const router = useRouter();
  const handleCardClick = (id: string) => {
    router.push(`/sections/${id}`);
  };

  return (
    <Card
      className="pt-0 w-full flex flex-col hover:cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out"
      onClick={() => handleCardClick(id)}
    >
      <CardContent className="px-0 relative overflow-hidden rounded-t-xl">
        <img
          src="https://cdn.shadcnstudio.com/ss-assets/components/card/image-2.png?height=280&format=auto"
          alt="Banner"
          className="aspect-video w-full object-cover scale-105"
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 min-w-0">
          <p className="min-w-0 break-words line-clamp-2">
            This is Example of course name blall abldjakl
          </p>
          <div
            className="
            w-8 h-8 rounded-full
            flex items-center justify-center
            hover:bg-[var(--gray-2)]
            transition-colors duration-200 ease-in-out
            cursor-pointer
          "
          >
            <CardOptions />
          </div>
        </CardTitle>
        <CardDescription className="text-sm line-clamp-3">
          Smooth, flowing gradients blending rich reds and blues in an abstract
          swirl. Smooth, flowing gradients blending rich reds and blues in an
          abstract swirl.
        </CardDescription>
      </CardHeader>

      <div className="flex items-center gap-2 w-full">
        <hr className="w-3/12" />
        <p className="text-sm">Instructors</p>
        <hr className="w-full" />
      </div>
      <CardFooter className="flex flex-col">
        <div className="flex justify-end w-full">
          <InstructorAvatars />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
