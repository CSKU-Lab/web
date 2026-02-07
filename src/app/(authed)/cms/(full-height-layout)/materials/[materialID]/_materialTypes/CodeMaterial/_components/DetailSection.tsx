"use client";
import { Globe, Lock } from "lucide-react";
import Loading from "~/components/commons/Loading";
import { Skeleton } from "~/components/ui/skeleton";
import { titleFormatter } from "~/lib/formatters/titleFormatter";
import useGetMaterial from "../../../../_hooks/useGetMaterial";
import { useAtomValue } from "jotai";
import { saveStatusAtom } from "../../_stores/save-status.store";
import SaveButton from "../SaveButton";
import type { JSX } from "react";
import SettingButton from "./DetailSection/SettingsButton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

interface HeaderDisplayOptions {
  name: boolean;
  type: boolean;
  submissions: boolean;
  createdBy: boolean;
  visibility: boolean;
  status: boolean;
}

interface DetailOptions {
  idx: keyof HeaderDisplayOptions;
  label: string;
  value: string | undefined | JSX.Element;
  body?: () => React.ReactNode;
}

interface DetailSectionProps {
  headerDisplay?: HeaderDisplayOptions;
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
  const { data: detail, isLoading } = useGetMaterial();
  const saveStatus = useAtomValue(saveStatusAtom);

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

  const detailItems: DetailOptions[] = [
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
    // {
    //   idx: "status",
    //   label: "Status",
    //   value: renderStatus(),
    // },
  ];

  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center jubstify-between gap-4">
      <div className="flex-1 flex gap-4 overflow-x-auto">
        {detailItems.map(
          (item) =>
            headerDisplay[item.idx] && (
              <HeaderItem
                key={item.idx}
                label={item.label}
                value={item.value}
                body={item.body}
                isLoading={isLoading}
              />
            ),
        )}
      </div>
      <div>
        <SaveButton />
        <SettingButton />
      </div>
    </div>
  );
}

interface HeaderItemProps {
  label: string;
  value: string | undefined | JSX.Element;
  isLoading: boolean;
  body?: () => React.ReactNode;
}
const HeaderItem = ({ label, value, isLoading, body }: HeaderItemProps) => {
  const render = () => {
		if(value.length > 20){
		}
    return (
      <div className="flex items-center gap-2 max-w-64 w-fit">
        {body && body()}
        <h4 className="font-medium truncate">{value}</h4>
      </div>
    );
  };
  return (
    <div>
      <h6 className="text-xs text-(--gray-11)">{label}</h6>
      <Loading
        isLoading={isLoading}
        fallback={<Skeleton className="w-32 h-6" />}
      >
        <Tooltip>
          <TooltipTrigger>
            <div className="flex items-center gap-2 max-w-64 w-fit">
              {body && body()}
              <h4 className="font-medium truncate">{value}</h4>
            </div>
          </TooltipTrigger>
          <TooltipContent>{value}</TooltipContent>
        </Tooltip>
      </Loading>
    </div>
  );
};

export default DetailSection;
