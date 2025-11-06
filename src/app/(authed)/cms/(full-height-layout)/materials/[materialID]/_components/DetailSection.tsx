import { Globe, Trash, Lock } from "lucide-react";
import { useMaterial } from "../_providers/MaterialProvider";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import { titleFormatter } from "~/lib/formatters/titleFormatter";

function DetailSection() {
  const { status, detail, isDetailLoading } = useMaterial();

  const renderStatus = () => {
    switch (status) {
      case "Saved":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--grass-9)"></div>
            <h4 className="font-medium">Saved</h4>
          </div>
        );
      case "Saving":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--amber-9) animate-pulse"></div>
            <h4 className="font-medium">Saving</h4>
          </div>
        );
      case "SaveFailed":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--red-9)"></div>
            <h4 className="font-medium">Failed to save</h4>
          </div>
        );
      case "Offline":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--gray-9)"></div>
            <h4 className="font-medium">Offline</h4>
          </div>
        );
    }
  };
  return (
    <div className="border border-l-0 2xl:border-l  p-4 mt-4 flex justify-between">
      <div className="flex gap-4">
        <div>
          <h6 className="text-xs text-(--gray-11)">Name</h6>
          <Loading
            isLoading={isDetailLoading}
            fallback={<Skeleton className="w-32 h-6" />}
          >
            <h4 className="font-medium">{detail?.name}</h4>
          </Loading>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Tags</h6>
          <h4 className="font-medium">Test</h4>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Submissions</h6>
          <h4 className="font-medium">126</h4>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Created By</h6>
          <Loading
            isLoading={isDetailLoading}
            fallback={<Skeleton className="w-32 h-6" />}
          >
            <h4 className="font-medium">{detail?.created_by}</h4>
          </Loading>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Visibility</h6>
          <div className="flex gap-1.5 items-center">
            <Loading
              isLoading={isDetailLoading}
              fallback={<Skeleton className="w-32 h-6" />}
            >
              {detail?.visibility === "public" && <Globe size="0.9rem" />}
              {detail?.visibility === "private" && <Lock size="0.9rem" />}
              <h4 className="font-medium">
                {titleFormatter(detail?.visibility ?? "")}
              </h4>
            </Loading>
          </div>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Status</h6>
          {renderStatus()}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1.5 bg-(--red-9)/10 hover:bg-(--red-9)/20 text-(--red-9) px-3 py-1.5 rounded text-sm transition-colors">
          <Trash size="1rem" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default DetailSection;
