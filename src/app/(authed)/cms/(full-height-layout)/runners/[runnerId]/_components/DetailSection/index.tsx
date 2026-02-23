import HeaderItem from "~/components/crafts/DetailSection/HeaderItem";
import SaveButton from "./SaveButton";
import SaveStatus from "./SaveStatus";
import SettingsButton from "./SettingsButton";
import useRunner from "../../_hooks/useRunner";

function DetailSection() {
  const { data: runner, isLoading } = useRunner();

  return (
    <div className="border border-l-0 2xl:border-l pl-4 pr-2 py-3 w-full flex items-center justify-between gap-4 mt-4">
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
        <SaveButton />
        <SettingsButton />
      </div>
    </div>
  );
}

export default DetailSection;
