import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import SaveButton from "./SaveButton";
import SaveStatus from "./SaveStatus";
import SettingsButton from "./SettingsButton";
import DeleteButton from "./DeleteButton";
import useRunner from "../../hooks/useRunner";
import { useParams } from "next/navigation";

function DetailSection() {
  const { runnerId } = useParams<{ runnerId: string }>();
  const { data: runner, isLoading } = useRunner(runnerId);

  return (
    <div className="border-b pl-4 pr-2 py-3 w-full flex items-center justify-between gap-4">
      <div className="flex-1 flex gap-4 overflow-x-auto">
        <HeaderItem label="Name" value={runner?.name} isLoading={isLoading} />
        <HeaderItem
          label="Description"
          value={runner?.description || "No description"}
          isLoading={isLoading}
        />
        <SaveStatus />
      </div>

      <div className="flex gap-2">
        <DeleteButton />
        <SaveButton />
        <SettingsButton />
      </div>
    </div>
  );
}

export default DetailSection;
