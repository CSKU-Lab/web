import { Skeleton } from "~/components/ui/skeleton";

export default function LabStatusLoading() {
  return (
    <div className="px-4">
      <div className="flex justify-between items-center gap-2 mb-4">
        <Skeleton className="w-48 h-9" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-20 h-7 rounded-full" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
