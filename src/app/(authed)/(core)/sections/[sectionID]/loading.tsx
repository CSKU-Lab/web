import { Skeleton } from "~/components/ui/skeleton";

export default function SectionLoading() {
  return (
    <div className="flex flex-col h-full overflow-x-hidden">
      <Skeleton className="w-full h-48" />
      <div className="px-4 lg:px-12 pb-4 flex flex-col flex-1">
        <div className="flex justify-between items-center gap-4 mt-6">
          <Skeleton className="w-16 h-8" />
          <Skeleton className="w-48 h-9" />
        </div>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="w-full h-20 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
