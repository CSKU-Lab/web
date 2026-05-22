import { Skeleton } from "~/components/ui/skeleton";

export default function LabMaterialsLoading() {
  return (
    <div className="px-4">
      <div className="flex justify-end items-center gap-2 mb-4">
        <Skeleton className="w-32 h-9" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-14 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
