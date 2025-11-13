"use client";
import { Globe, Lock, Save } from "lucide-react";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import useGetMaterial from "../../../_hooks/useGetMaterial";
import { useAtomValue } from "jotai";
import { saveStatusAtom } from "../_stores/save-status.store";
import SaveButton from "./SaveButton";

function DetailSection() {
  const { data: detail, isFetching } = useGetMaterial();
  const saveStatus = useAtomValue(saveStatusAtom);

  const handleSave = () => {};

  const renderStatus = () => {
    switch (saveStatus) {
      case "UnSaved":
        return (
          <div className="flex gap-1.5 items-center">
            <div className="w-2 h-2 rounded-full bg-(--gray-9)"></div>
            <h4 className="font-medium">Unsaved</h4>
          </div>
        );
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
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 mt-4 flex justify-between items-center">
      <div className="flex gap-4">
        <div>
          <h6 className="text-xs text-(--gray-11)">Name</h6>
          <Loading
            isLoading={isFetching}
            fallback={<Skeleton className="w-32 h-6" />}
          >
            <h4 className="font-medium">{detail?.name}</h4>
          </Loading>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Type</h6>
          <Loading
            isLoading={isFetching}
            fallback={<Skeleton className="w-32 h-6" />}
          >
            <h4 className="font-medium">
              {titleFormatter(detail?.type ?? "")}
            </h4>
          </Loading>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Submissions</h6>
          <h4 className="font-medium">126</h4>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Created By</h6>
          <Loading
            isLoading={isFetching}
            fallback={<Skeleton className="w-32 h-6" />}
          >
            <h4 className="font-medium">{detail?.created_by}</h4>
          </Loading>
        </div>
        <div>
          <h6 className="text-xs text-(--gray-11)">Visibility</h6>
          <div className="flex gap-1.5 items-center">
            <Loading
              isLoading={isFetching}
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
      <SaveButton />
    </div>
  );
}

export default DetailSection;
