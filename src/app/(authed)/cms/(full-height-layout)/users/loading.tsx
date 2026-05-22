import { Skeleton } from "~/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <>
      <Skeleton className="w-40 h-8 mx-4 mt-2" />
      <div className="flex flex-wrap justify-end items-center gap-2 mt-4 px-4">
        <Skeleton className="w-48 h-9" />
        <Skeleton className="w-9 h-9" />
        <Skeleton className="w-28 h-9" />
        <Skeleton className="w-24 h-9" />
        <Skeleton className="w-24 h-9" />
      </div>
      <div className="mt-4 px-4 space-y-1">
        <Skeleton className="w-full h-10 rounded-lg" />
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="w-full h-12 rounded-none opacity-70" />
        ))}
      </div>
    </>
  );
}
