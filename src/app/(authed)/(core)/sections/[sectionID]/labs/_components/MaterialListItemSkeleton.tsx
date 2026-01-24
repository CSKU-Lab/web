import { Skeleton } from "~/components/ui/skeleton";

export default function MaterialListItemSkeleton() {
  return (
    <div
      className="
        grid grid-cols-10 gap-4
        w-full px-4 py-3 items-center
        odd:bg-(--gray-2)
      "
    >
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="col-span-9 h-6 w-3/4" />
    </div>
  );
}
