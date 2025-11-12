import { X } from "lucide-react";
import AutoComplete from "~/components/commons/AutoComplete";
import CodeMirror from "~/components/Editor/CodeMirror";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { configService } from "~/services/config.service";
import type { RunnerConfigDetail } from "~/types/config";

interface Props {
  value: RunnerConfigDetail[];
  onChange: (value: RunnerConfigDetail[]) => void;
}
function AllowedRunners({ value, onChange }: Props) {
  return (
    <AutoComplete
      value={value}
      onChange={onChange}
      queryFn={(query) =>
        configService.getRunners({ search: query, includeScript: true })
      }
      queryOnRender
      renderSelected={({ option, handleOnRemove }) => (
        <HoverCard key={option.id}>
          <HoverCardTrigger asChild>
            <div
              key={option.id}
              className="px-2 rounded-full bg-(--gray-3) flex items-center gap-2 border"
            >
              <div className="w-2 h-2 rounded-full bg-(--accent-color)"></div>
              <p className="text-sm">{option.name}</p>
              <button onClick={() => handleOnRemove(option)}>
                <X size="0.965rem" />
              </button>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="p-0 w-80">
            <div className="p-2 rounded-md">
              <h5 className="text-sm font-medium">{option.name}</h5>
              <h6 className="text-xs mt-1.5">Build Script</h6>
              <CodeMirror
                value={option.build_script}
                className="h-30 rounded-md border overflow-hidden mt-2"
              />
              <h6 className="text-xs mt-1.5">Run Script</h6>
              <CodeMirror
                value={option.run_script}
                className="h-30 rounded-md border overflow-hidden mt-2"
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      popoverContentClasses="max-h-60"
    >
      {({ options, handleOnAdd }) => (
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <div
              key={option.id}
              className="hover:bg-(--gray-2) p-2 rounded-md cursor-pointer"
              onClick={() => handleOnAdd(option)}
            >
              <h5 className="text-sm font-medium">{option.name}</h5>
              <h6 className="text-xs mt-1.5">Build Script</h6>
              <CodeMirror
                value={option.build_script}
                className="h-30 rounded-md border overflow-hidden mt-2"
              />
              <h6 className="text-xs mt-1.5">Run Script</h6>
              <CodeMirror
                value={option.run_script}
                className="h-30 rounded-md border overflow-hidden mt-2"
              />
            </div>
          ))}
        </div>
      )}
    </AutoComplete>
  );
}

export default AllowedRunners;
