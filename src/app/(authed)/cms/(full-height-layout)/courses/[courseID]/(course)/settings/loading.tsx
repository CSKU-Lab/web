import { Skeleton } from "~/components/ui/skeleton";

function CardSkeleton({ danger }: { danger?: boolean }) {
  return (
    <div className={`bg-(--gray-1) border border-(--gray-5) rounded-lg p-6 ${danger ? "bg-(--red-3) border-(--red-6)" : ""}`}>
      <div className="mb-6">
        <Skeleton className={`w-40 h-7 ${danger ? "bg-(--red-6)" : ""}`} />
        <Skeleton className={`w-72 h-4 mt-2 ${danger ? "bg-(--red-6)" : ""}`} />
        <hr className={`my-4 ${danger ? "border-(--red-6)" : ""}`} />
      </div>
      {danger ? (
        <Skeleton className="w-36 h-9" />
      ) : (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-56 h-4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-full h-9 rounded-md" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-full h-9 rounded-md" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Skeleton className="w-20 h-5" />
              <Skeleton className="w-64 h-4" />
            </div>
            <div className="space-y-2">
              <Skeleton className="w-full h-5 rounded-full max-w-xs" />
              <Skeleton className="w-full h-5 rounded-full max-w-xs" />
            </div>
          </div>
          <Skeleton className="w-full h-10 rounded-md" />
        </div>
      )}
    </div>
  );
}

export default function SettingsLoading() {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl space-y-8 2xl:mt-10">
        <CardSkeleton />
        <CardSkeleton danger />
      </div>
    </div>
  );
}
