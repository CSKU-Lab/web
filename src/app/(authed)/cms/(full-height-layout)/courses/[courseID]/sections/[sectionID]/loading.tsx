import { Skeleton } from "~/components/ui/skeleton";

export default function SectionStudentsLoading() {
  return (
    <>
      <Skeleton className="w-48 h-8 mx-4 mt-2" />
      <div className="mt-4 mb-8 ml-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-8 rounded-lg" />
        ))}
      </div>
      <div className="p-4">
        <Skeleton className="w-28 h-5" />
        <div className="flex items-center gap-4 mt-4">
          <Skeleton className="flex-1 h-9" />
          <Skeleton className="w-32 h-9" />
          <Skeleton className="w-28 h-9" />
        </div>
        <div className="mt-8 grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-44" />
          ))}
        </div>
      </div>
    </>
  );
}
