import { Skeleton } from "~/components/ui/skeleton";

export default function SectionSettingsLoading() {
  return (
    <>
      <Skeleton className="w-24 h-8 mx-4 mt-2" />
      <div className="mt-4 mb-8 ml-4 flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-8 rounded-lg" />
        ))}
      </div>
      <div className="flex justify-center">
        <div className="w-full max-w-4xl space-y-8 2xl:mt-10">
          <div className="bg-(--gray-1) border border-(--gray-5) rounded-lg p-6 space-y-4">
            <Skeleton className="w-36 h-7" />
            <Skeleton className="w-72 h-4" />
            <hr className="my-4" />
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="w-28 h-4" />
                <Skeleton className="w-full h-9 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-full h-24 rounded-md" />
              </div>
              <div className="space-y-2">
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-full h-9 rounded-md" />
              </div>
            </div>
            <Skeleton className="w-full h-10 rounded-md" />
          </div>
          <div className="bg-(--red-3) border border-(--red-6) rounded-lg p-6 space-y-4">
            <Skeleton className="w-28 h-7" />
            <Skeleton className="w-80 h-4" />
            <hr className="border-(--red-6) my-4" />
            <Skeleton className="w-36 h-9" />
          </div>
        </div>
      </div>
    </>
  );
}
