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
    <div className="p-4 overflow-y-auto h-full">
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
          description="The maximum amount of time (in seconds) the CPU is allowed to spend executing the program. If the program exceeds this limit, it will be terminated with a &quot;Time Limit Exceeded&quot; (TLE) error."
          errorMessage="CPU Time must be a positive integer or zero."
          isError={limit.cpu_time < 0}
          value={limit?.cpu_time.toString()}
          onChange={(e) => handleOnLimitChange("cpu_time", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="CPU Extra Time (seconds)"
          description="Additional CPU time allocated specifically to accommodate slower, interpreted, or VM-based languages (such as Python or Java) during startup or initialization."
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
          description="The total elapsed real-world time (clock time) allowed for the execution from start to finish. This prevents the server from hanging if a program becomes idle or enters a sleep state."
          errorMessage="Wall Time must be a positive integer or zero."
          isError={limit.wall_time < 0}
          value={limit?.wall_time.toString()}
          onChange={(e) => handleOnLimitChange("wall_time", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="Memory (KB)"
          description="The maximum amount of RAM (in Kilobytes) the program is permitted to allocate. Exceeding this limit results in a &quot;Memory Limit Exceeded&quot; (MLE) or &quot;Runtime Error&quot;. (Note: 1,024 KB = 1 MB)"
          errorMessage="Memory must be a positive integer or zero."
          isError={limit.memory < 0}
          value={limit?.memory.toString()}
          onChange={(e) => handleOnLimitChange("memory", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="Stack (KB)"
          description="The maximum size allocated for the program's call stack. This is crucial for handling deep recursion; if the limit is too low, recursive algorithms may trigger a &quot;Stack Overflow&quot; error."
          errorMessage="Stack must be a positive integer or zero."
          isError={limit.stack < 0}
          value={limit?.stack.toString()}
          onChange={(e) => handleOnLimitChange("stack", e.target.value)}
          disabled={!isOwner}
        />
        <Input
          label="Max Open Files"
          description="The maximum number of files or file descriptors the program is allowed to open concurrently. This is a security measure to prevent resource exhaustion on the server."
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
          description="The maximum allowable size (in Kilobytes) for any single file created or written by the program. This prevents infinite print/write loops from filling up the server's hard drive."
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
          <p className="text-xs text-(--gray-11)">A security toggle that determines whether the running code can access the internet or external networks. For student assignments, this is typically disabled to prevent cheating or data exfiltration.</p>
        </div>
      </div>
    </div>
  );
}

export default ConfigTab;
