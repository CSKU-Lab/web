import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Instructor } from "~/types/core-section";

interface InstructorAvatarsProps {
  instructors: Instructor[];
}

export function InstructorAvatars({ instructors }: InstructorAvatarsProps) {
  return (
    <div className="flex flex-row flex-wrap items-center gap-12">
      <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
        {instructors.map((ins) => (
          <Avatar key={ins.id} className="h-8 w-8">
            <AvatarImage src={ins.profile_image ?? undefined} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  );
}
