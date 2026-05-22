import { Skeleton } from "~/components/ui/skeleton";

export default function SectionLabSettingsLoading() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-8 2xl:mt-10">
        <div className="bg-(--gray-1) border border-(--gray-5) rounded-lg p-6 space-y-4">
          <Skeleton className="w-32 h-7" />
          <Skeleton className="w-64 h-4" />
          <hr className="my-4" />
          <div className="space-y-2">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-full h-9 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="w-24 h-4" />
            <Skeleton className="w-full h-9 rounded-md" />
          </div>
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      </div>
    </div>
  );
}
