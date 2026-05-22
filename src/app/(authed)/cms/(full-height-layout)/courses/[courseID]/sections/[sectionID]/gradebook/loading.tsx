import { Skeleton } from "~/components/ui/skeleton";

export default function GradebookLoading() {
  return (
    <>
      <div className="flex items-center justify-between px-4 mt-2">
        <Skeleton className="w-28 h-8" />
        <Skeleton className="w-32 h-9" />
      </div>
      <div className="mt-4 mb-8 ml-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-8 rounded-lg" />
        ))}
      </div>
      <div className="mt-4 px-4 space-y-1">
        <Skeleton className="w-full h-9 rounded-lg" />
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-9 rounded-none opacity-70" />
        ))}
      </div>
    </>
  );
}
