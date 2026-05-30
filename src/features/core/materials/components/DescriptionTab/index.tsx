import { SimpleEditor } from "~/components/tiptap-templates/simple/simple-editor";
import useGetCoreMaterial from "~/features/core/materials/hooks/useGetCoreMaterial";
import type { CoreCodeMaterial } from "~/types/core-code-material";
import {
  Clock,
  Cpu,
  MemoryStick,
  HardDrive,
  File,
  Network,
} from "lucide-react";
import { kiloToMegaBytes } from "~/components/Editor/utils/kilo-to-megabytes";
import { Skeleton } from "~/components/ui/skeleton";

interface LimitItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLoading?: boolean;
}

function LimitItem({ icon, label, value, isLoading }: LimitItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-(--gray-3) rounded-lg">
      <div className="text-(--gray-11)">{icon}</div>
      <div className="flex-1">
        <p className="text-xs text-(--gray-11)">{label}</p>
        {isLoading ? (
          <Skeleton className="w-16 h-4 mt-1" />
        ) : (
          <p className="font-medium text-sm">{value}</p>
        )}
      </div>
    </div>
  );
}

function DescriptionTab() {
  const { data: material, isLoading } = useGetCoreMaterial<CoreCodeMaterial>();

  const getDescriptionContent = () => {
    if (isLoading) return null;

    try {
      return JSON.parse(material?.payload.description ?? "");
    } catch {
      return null;
    }
  };

  const limits = material?.payload.limits;

  const hasAnyLimits =
    limits &&
    (limits.cpu_time > 0 ||
      limits.wall_time > 0 ||
      limits.cpu_extra_time > 0 ||
      limits.memory > 0 ||
      limits.stack > 0 ||
      limits.max_open_files > 0 ||
      limits.max_file_size > 0 ||
      limits.network_allow);

  return (
    <div className="p-4 space-y-4">
      {(isLoading || hasAnyLimits) && (
        <>
          <div>
            <h4 className="text-sm font-medium mb-3">Resource Limits</h4>
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <LimitItem
                  icon={<Cpu size="1.25rem" />}
                  label="CPU Time"
                  value="-"
                  isLoading
                />
                <LimitItem
                  icon={<Clock size="1.25rem" />}
                  label="Wall Time"
                  value="-"
                  isLoading
                />
                <LimitItem
                  icon={<MemoryStick size="1.25rem" />}
                  label="Memory"
                  value="-"
                  isLoading
                />
              </div>
            ) : hasAnyLimits ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {limits.cpu_time > 0 && (
                  <LimitItem
                    icon={<Cpu size="1.25rem" />}
                    label="CPU Time"
                    value={`${limits.cpu_time} s`}
                  />
                )}
                {limits.wall_time > 0 && (
                  <LimitItem
                    icon={<Clock size="1.25rem" />}
                    label="Wall Time"
                    value={`${limits.wall_time} s`}
                  />
                )}
                {limits.cpu_extra_time > 0 && (
                  <LimitItem
                    icon={<Clock size="1.25rem" />}
                    label="Extra Time"
                    value={`${limits.cpu_extra_time} s`}
                  />
                )}
                {limits.memory > 0 && (
                  <LimitItem
                    icon={<MemoryStick size="1.25rem" />}
                    label="Memory"
                    value={`${kiloToMegaBytes(limits.memory)} MB`}
                  />
                )}
                {limits.stack > 0 && (
                  <LimitItem
                    icon={<HardDrive size="1.25rem" />}
                    label="Stack"
                    value={`${kiloToMegaBytes(limits.stack)} MB`}
                  />
                )}
                {limits.max_open_files > 0 && (
                  <LimitItem
                    icon={<File size="1.25rem" />}
                    label="Max Files"
                    value={`${limits.max_open_files}`}
                  />
                )}
                {limits.max_file_size > 0 && (
                  <LimitItem
                    icon={<HardDrive size="1.25rem" />}
                    label="Max File Size"
                    value={`${kiloToMegaBytes(limits.max_file_size)} MB`}
                  />
                )}
                {limits.network_allow && (
                  <LimitItem
                    icon={<Network size="1.25rem" />}
                    label="Network"
                    value="Allowed"
                  />
                )}
              </div>
            ) : null}
          </div>

          <div className="h-px bg-(--gray-6)" />
        </>
      )}

      <div>
        <SimpleEditor
          readOnly
          initialValue={getDescriptionContent()}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default DescriptionTab;
