import { Skeleton } from "~/components/ui/skeleton";

export default function CoursesLoading() {
  return (
    <>
      <Skeleton className="w-28 h-8 mx-4 mt-2" />
      <div className="@container flex flex-col h-full px-4">
        <div className="flex justify-end items-center gap-2 my-4">
          <Skeleton className="w-48 h-9" />
          <Skeleton className="w-24 h-9" />
          <Skeleton className="w-28 h-9" />
        </div>
        <div className="mt-4 grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @6xl:grid-cols-4 gap-4 auto-rows-max">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    </>
  );
}
