import { Skeleton } from "~/components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="relative rounded-xl overflow-hidden aspect-video border border-(--gray-4)">
      <Skeleton className="absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 p-4 space-y-2">
        <Skeleton className="w-3/4 h-4" />
        <div className="flex gap-1">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;
