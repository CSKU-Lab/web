import Input from "~/components/crafts/Input";
import CompareScript from "~/features/cms/materials/types/CodeMaterial/components/ConfigTab/CompareScript";
import { useAtom, useAtomValue } from "jotai";
import { compareScriptAtom, limitAtom } from "~/features/cms/materials/types/CodeMaterial/stores/config.store";
import { isOwnerAtom } from "~/features/cms/materials/types/CodeMaterial/stores/owner.store";
import Label from "~/components/commons/Label";
import { Switch } from "~/components/ui/switch";
import type { CodeMaterialLimit } from "~/features/cms/materials/types/CodeMaterial/types/limit";

function ConfigTab() {
  const [compareScript, setCompareScript] = useAtom(compareScriptAtom);
  const [limit, setLimit] = useAtom(limitAtom);
  const isOwner = useAtomValue(isOwnerAtom);

  const handleOnLimitChange = (
    field: keyof CodeMaterialLimit,
    value: string,
  ) => {
    const intValue = parseInt(value, 10);
    if (isNaN(intValue)) {
      setLimit({ ...limit, [field]: 0 });
      return;
    }

    setLimit({ ...limit, [field]: intValue });
  };

  return (
    <div className="p-4">
      <h5 className="my-2 font-medium">General</h5>
      <h6 className="my-2 text-sm">Compare Script</h6>
      <CompareScript
        value={compareScript}
        onChange={setCompareScript}
        isOwner={isOwner}
      />
      <div className="h-1 border-b my-4"></div>
      <h5 className="my-2 font-medium">Limits</h5>
      <div className="space-y-2">
        <Input
          label="CPU Time (seconds)"
          errorMessage="CPU Time must be a positive integer or zero."
          isError={limit.cpu_time < 0}
          value={limit?.cpu_time.toString()}
          onChange={(e) => handleOnLimitChange("cpu_time", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="CPU Extra Time (seconds)"
          errorMessage="CPU Extra Time must be a positive integer or zero."
          isError={limit.cpu_extra_time < 0}
          value={limit?.cpu_extra_time.toString()}
          onChange={(e) =>
            handleOnLimitChange("cpu_extra_time", e.target.value)
          }
          disabled={!isOwner}
        />
        <Input
          label="Wall Time (seconds)"
          errorMessage="Wall Time must be a positive integer or zero."
          isError={limit.wall_time < 0}
          value={limit?.wall_time.toString()}
          onChange={(e) => handleOnLimitChange("wall_time", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="Memory (KB)"
          errorMessage="Memory must be a positive integer or zero."
          isError={limit.memory < 0}
          value={limit?.memory.toString()}
          onChange={(e) => handleOnLimitChange("memory", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="Stack (KB)"
          errorMessage="Stack must be a positive integer or zero."
          isError={limit.stack < 0}
          value={limit?.stack.toString()}
          onChange={(e) => handleOnLimitChange("stack", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="Max Open Files"
          errorMessage="Max Open Files must be a positive integer or zero."
          isError={limit.max_open_files < 0}
          value={limit?.max_open_files.toString()}
          onChange={(e) =>
            handleOnLimitChange("max_open_files", e.target.value)
          }
          disabled={!isOwner}
        />
        <Input
          label="Max File Sizes (KB)"
          errorMessage="Max File Sizes must be a positive integer or zero."
          isError={limit.max_file_size < 0}
          value={limit?.max_file_size.toString()}
          onChange={(e) => handleOnLimitChange("max_file_size", e.target.value)}
          disabled={!isOwner}
        />
        <div className="space-y-2">
          <Label>Allow Network</Label>
          <Switch
            checked={limit?.network_allow}
            onCheckedChange={() =>
              setLimit({ ...limit, network_allow: !limit.network_allow })
            }
            disabled={!isOwner}
          />
        </div>
      </div>
    </div>
  );
}

export default ConfigTab;
