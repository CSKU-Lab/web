import { titleFormatter } from "~/lib/formatters/titleFormatter";
import useGetMaterial from "../../../../_hooks/useGetMaterial";
import HeaderItem from "./HeaderItem";
import SaveButton from "./SaveButton";
import SaveStatus from "./SaveStatus";
import SettingsButton from "./SettingsButton";
import { Globe, Lock } from "lucide-react";

function DetailSection() {
  const { data: detail, isLoading } = useGetMaterial();
  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center jubstify-between gap-4">
      <div className="flex-1 flex gap-4 overflow-x-auto">
        <HeaderItem label="Name" value={detail?.name} isLoading={isLoading} />
        <HeaderItem
          label="Type"
          value={titleFormatter(detail?.type ?? "")}
          isLoading={isLoading}
        />
        <HeaderItem
          label="Created By"
          value={detail?.created_by}
          isLoading={isLoading}
        />

        <HeaderItem
          label="Visibility"
          value={
            <div className="flex items-center gap-2">
              {detail?.visibility === "public" && <Globe size="0.9rem" />}
              {detail?.visibility === "private" && <Lock size="0.9rem" />}
              <h4 className="font-medium">
                {titleFormatter(detail?.visibility ?? "")}
              </h4>
            </div>
          }
          isLoading={isLoading}
        />
        <HeaderItem
          label="Type"
          value={titleFormatter(detail?.type ?? "")}
          isLoading={isLoading}
        />
        <HeaderItem label="Submissions" value={10000} isLoading={isLoading} />
        <SaveStatus />
      </div>

      <div className="flex gap-2">
        <SaveButton />
        <SettingsButton />
      </div>
    </div>
  );
}

export default DetailSection;
