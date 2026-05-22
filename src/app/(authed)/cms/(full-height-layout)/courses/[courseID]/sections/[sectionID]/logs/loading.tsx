import { Skeleton } from "~/components/ui/skeleton";

export default function LogsLoading() {
  return (
    <>
      <Skeleton className="w-16 h-8 mx-4 mt-2" />
      <div className="mt-4 mb-8 ml-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-8 rounded-lg" />
        ))}
      </div>
      <div className="ml-4 space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="w-24 h-4" />
            {Array.from({ length: 4 }).map((_, j) => (
              <Skeleton key={j} className="w-full h-10 rounded-lg" />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
