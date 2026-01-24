import { Skeleton } from "~/components/ui/skeleton";

export const LabItemSkeleton = () => {
  return (
    <div className="rounded-lg shadow-md p-4">
      {/* Header */}
      <div className="flex flex-row justify-between items-center">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>

      {/* Divider */}
      <Skeleton className="h-px w-full my-4" />

      {/* Content */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};
