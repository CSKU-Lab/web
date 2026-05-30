import { Skeleton } from "~/components/ui/skeleton";

export const LabItemSkeleton = () => {
  return (
    <div className="rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) p-4 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex items-center gap-2 mt-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </div>
    </div>
  );
};
