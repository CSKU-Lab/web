import { Skeleton } from "~/components/ui/skeleton";

export default function MaterialLoading() {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      <Skeleton className="w-48 h-8" />
      <Skeleton className="w-full flex-1 min-h-96 rounded-lg" />
    </div>
  );
}
