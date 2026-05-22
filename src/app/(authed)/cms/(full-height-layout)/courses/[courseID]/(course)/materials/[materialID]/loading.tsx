import { Skeleton } from "~/components/ui/skeleton";

export default function MaterialLoading() {
  return (
    <div className="flex h-full">
      <div className="flex-1 p-6 space-y-4">
        <Skeleton className="w-48 h-8" />
        <Skeleton className="w-full h-12 rounded-lg" />
        <Skeleton className="w-full flex-1 min-h-96 rounded-lg" />
      </div>
      <div className="w-72 border-l p-4 space-y-4">
        <Skeleton className="w-24 h-5" />
        <Skeleton className="w-full h-9 rounded-md" />
        <Skeleton className="w-24 h-5 mt-4" />
        <Skeleton className="w-full h-9 rounded-md" />
        <Skeleton className="w-full h-9 rounded-md" />
      </div>
    </div>
  );
}
