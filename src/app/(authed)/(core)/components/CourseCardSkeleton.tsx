import { Skeleton } from "~/components/ui/skeleton";

const CourseCardSkeleton = () => {
  return (
    <div className="block rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4)">
      <Skeleton className="h-5 w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-1 mt-2">
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default CourseCardSkeleton;