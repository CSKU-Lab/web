import { Skeleton } from "~/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="@container bg-(--gray-1) h-full p-4 gap-6 flex flex-col w-full">
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-40 h-7" />
          <Skeleton className="w-16 h-4" />
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-32 h-7" />
          <Skeleton className="w-48 h-9" />
        </div>
        <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
