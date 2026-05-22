import { Skeleton } from "~/components/ui/skeleton";

export default function MaterialsLoading() {
  return (
    <div className="px-4">
      <div className="flex justify-end items-center gap-2 my-4">
        <Skeleton className="w-48 h-9" />
        <Skeleton className="w-28 h-9" />
      </div>
      <div className="space-y-2 mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-lg w-full" />
        ))}
      </div>
    </div>
  );
}
