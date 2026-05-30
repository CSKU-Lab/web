import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

export function SubmissionCardSkeleton() {
  return (
    <div className="border flex justify-between items-center gap-2 px-4 py-2 rounded-lg bg-(--gray-2) border-(--gray-6) w-full">
      <div className="flex flex-col items-start gap-1">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2 text-xs">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-3 w-40 mt-1" />
      </div>
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  );
}

export function SubmissionCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <SubmissionCardSkeleton key={index} />
      ))}
    </div>
  );
}
