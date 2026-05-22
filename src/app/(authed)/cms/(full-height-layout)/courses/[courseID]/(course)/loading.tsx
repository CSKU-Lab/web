import { Skeleton } from "~/components/ui/skeleton";

export default function CourseLoading() {
  return (
    <div className="@container px-4">
      <div className="flex justify-end items-center gap-2">
        <Skeleton className="w-28 h-9" />
      </div>
      <div className="mt-10 space-y-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-48 h-6 mt-2" />
            <hr className="my-2" />
            <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 @2xl:grid-cols-4 @6xl:grid-cols-5 gap-4 auto-rows-max mt-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Skeleton key={j} className="h-40 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
