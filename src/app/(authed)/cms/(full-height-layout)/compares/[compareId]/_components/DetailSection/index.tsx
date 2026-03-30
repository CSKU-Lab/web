import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import SaveButton from "./SaveButton";
import SaveStatus from "./SaveStatus";
import SettingsButton from "./SettingsButton";
import DeleteButton from "./DeleteButton";
import useCompare from "../../_hooks/useCompare";
import { useParams } from "next/navigation";

function DetailSection() {
  const { compareId } = useParams<{ compareId: string }>();
  const { data: compare, isLoading } = useCompare(compareId);

  return (
    <div className="border-b pl-4 pr-2 py-3 w-full flex items-center justify-between gap-4">
      <div className="flex-1 flex gap-4 overflow-x-auto">
        <HeaderItem label="Name" value={compare?.name} isLoading={isLoading} />
        <HeaderItem
          label="Description"
          value={compare?.description || "No description"}
          isLoading={isLoading}
        />
        <HeaderItem
          label="Run Name"
          value={compare?.run_name}
          isLoading={isLoading}
        />
        <SaveStatus />
      </div>

      <div className="flex gap-2">
        <SaveButton />
        <SettingsButton />
        <DeleteButton />
      </div>
    </div>
  );
}

export default DetailSection;
