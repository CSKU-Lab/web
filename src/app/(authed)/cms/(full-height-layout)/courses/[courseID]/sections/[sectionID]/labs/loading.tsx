import { Skeleton } from "~/components/ui/skeleton";

export default function SectionLabsLoading() {
  return (
    <>
      <Skeleton className="w-36 h-8 mx-4 mt-2" />
      <div className="mt-4 mb-8 ml-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-8 rounded-lg" />
        ))}
      </div>
      <div className="@container px-4">
        <div className="flex justify-end items-center gap-2 mb-4">
          <Skeleton className="w-48 h-9" />
          <Skeleton className="w-24 h-9" />
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-md" />
          ))}
        </div>
      </div>
    </>
  );
}
