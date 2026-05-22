import { Skeleton } from "~/components/ui/skeleton";

export default function SemestersLoading() {
  return (
    <>
      <Skeleton className="w-48 h-8 mx-4 mt-2" />
      <div className="flex justify-end items-center gap-2 mt-4 px-4">
        <Skeleton className="w-48 h-9" />
        <Skeleton className="w-28 h-9" />
      </div>
      <div className="mt-4 px-4 space-y-1">
        <Skeleton className="w-full h-9 rounded-lg" />
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-9 rounded-none opacity-70" />
        ))}
      </div>
    </>
  );
}
