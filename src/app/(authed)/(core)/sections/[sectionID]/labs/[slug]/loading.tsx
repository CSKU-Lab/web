import { Skeleton } from "~/components/ui/skeleton";

export default function LabLoading() {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-4 space-y-4">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-full flex-1 min-h-96 rounded-lg" />
      </div>
      <div className="w-64 border-l p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-12 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
