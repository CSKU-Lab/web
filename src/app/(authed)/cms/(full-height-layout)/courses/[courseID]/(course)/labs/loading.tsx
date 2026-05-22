import { Skeleton } from "~/components/ui/skeleton";

export default function LabsLoading() {
  return (
    <div className="@container flex flex-col h-full px-4">
      <div className="flex justify-end items-center gap-2">
        <Skeleton className="w-48 h-9" />
        <Skeleton className="w-28 h-9" />
      </div>
      <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 gap-4 mt-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-md" />
        ))}
      </div>
    </div>
  );
}
