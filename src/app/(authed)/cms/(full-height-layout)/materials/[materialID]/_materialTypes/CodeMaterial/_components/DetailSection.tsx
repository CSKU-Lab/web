"use client";
import { Globe, Lock, Save } from "lucide-react";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import useGetMaterial from "../../../_hooks/useGetMaterial";
import { useAtomValue } from "jotai";
import { saveStatusAtom } from "../_stores/save-status.store";
import SaveButton from "./SaveButton";
import { JSX } from "react";

interface DetailSectionProps {
  headerDisplay?: Record<string, boolean>;
}

function DetailSection({
  headerDisplay = {
    name: true,
    type: true,
    submissions: true,
    createdBy: true,
    visibility: true,
    status: true,
  },
}: DetailSectionProps) {
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

  const detailItems = [
    {
      idx: "name",
      label: "Name",
      value: detail?.name,
    },
    {
      idx: "type",
      label: "Type",
      value: titleFormatter(detail?.type ?? ""),
    },
    {
      idx: "submissions",
      label: "Submissions",
      value: "126",
    },
    {
      idx: "createdBy",
      label: "Created By",
      value: detail?.created_by,
    },
    {
      idx: "visibility",
      label: "Visibility",
      value: titleFormatter(detail?.visibility ?? ""),
      body: () => (
        <>
          {detail?.visibility === "public" && <Globe size="0.9rem" />}
          {detail?.visibility === "private" && <Lock size="0.9rem" />}
        </>
      ),
    },
    {
      idx: "status",
      label: "Status",
      value: renderStatus(),
    },
  ];

  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 flex justify-between items-center">
      <div className="flex gap-4">
        {detailItems.map(
          (item, i) =>
            headerDisplay[item.idx] && (
              <HeaderItem
                key={item.idx}
                label={item.label}
                value={item.value}
                body={item.body}
                isFetching={isFetching}
              />
            ),
        )}
      </div>
      <SaveButton />
    </div>
  );
}

interface HeaderItemProps {
  label: string;
  value: string | undefined | JSX.Element;
  isFetching: boolean;
  body?: () => React.ReactNode;
}
const HeaderItem = ({ label, value, isFetching, body }: HeaderItemProps) => {
  return (
    <div>
      <h6 className="text-xs text-(--gray-11)">{label}</h6>
      <Loading
        isLoading={isFetching}
        fallback={<Skeleton className="w-32 h-6" />}
      >
        <div className="flex items-center gap-2">
          {body && body()}
          <h4 className="font-medium">{value}</h4>
        </div>
      </Loading>
    </div>
  );
};

export default DetailSection;
