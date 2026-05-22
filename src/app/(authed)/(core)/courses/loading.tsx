import { Skeleton } from "~/components/ui/skeleton";

export default function CourseExplorerLoading() {
  return (
    <div className="@container bg-(--gray-1) h-full p-4 gap-6 flex flex-col w-full">
      <div className="flex justify-between items-center gap-4">
        <Skeleton className="w-48 h-9" />
        <Skeleton className="w-48 h-9" />
      </div>
      <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
