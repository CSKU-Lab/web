import { Skeleton } from "~/components/ui/skeleton";

export default function MaterialListItemSkeleton() {
  return (
    <div className="rounded-md overflow-hidden bg-(--gray-1) border border-(--gray-4) flex flex-col">
      <Skeleton className="h-5 w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}
