import { X, Server } from "lucide-react";
import AutoComplete from "~/components/commons/AutoComplete";
import CodeMirror from "~/components/Editor/CodeMirror";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "~/components/ui/hover-card";
import { cn } from "~/lib/utils";
import { cmsRunnerService } from "~/services/cms-runner.service";
import { RunnerConfigDetail } from "~/types/cms-runner";

interface Props {
  value: RunnerConfigDetail[];
  onChange: (value: RunnerConfigDetail[]) => void;
  isOwner: boolean;
}
function AllowedRunners({ value, onChange, isOwner }: Props) {
  return (
    <AutoComplete
      value={value}
      onChange={onChange}
      queryFn={async (query) => {
        const res = await cmsRunnerService.getPagination({
          params: { search: query },
          includeScripts: true,
        });
        return res.data;
      }}
      disabled={!isOwner}
      placeHolder="Search runners..."
      renderSelected={({ option, handleOnRemove }) => (
        <HoverCard key={option.id}>
          <HoverCardTrigger asChild>
            <div
              key={option.id}
              className="group/runner px-2.5 py-1 rounded-full bg-gradient-to-r from-(--accent-color)/10 to-(--accent-color)/5 border border-(--accent-color)/20 flex items-center gap-1.5 shadow-sm hover:shadow-md hover:border-(--accent-color)/30 transition-all duration-200 cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-(--accent-color) ring-2 ring-(--accent-color)/20"></div>
              <span className="text-xs font-medium text-(--gray-12)">
                {option.name}
              </span>
              {isOwner && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOnRemove(option);
                  }}
                  className="p-0.5 rounded-full hover:bg-(--gray-3) hover:text-(--red-9) text-(--gray-10) transition-all duration-150 opacity-80 group-hover/runner:opacity-100"
                  aria-label={`Remove ${option.name}`}
                >
                  <X size="12" strokeWidth={2.5} />
                </button>
              )}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="p-0 w-80 border border-(--gray-5) shadow-xl shadow-black/5 rounded-lg">
            <div className="p-3 rounded-md">
              <h5 className="text-sm font-medium text-(--gray-12)">
                {option.name}
              </h5>
              <h6 className="text-xs mt-2 text-(--gray-10)">Build Script</h6>
              <CodeMirror
                value={option.build_script}
                className="h-30 rounded-md border border-(--gray-4) overflow-hidden mt-1.5"
              />
              <h6 className="text-xs mt-2 text-(--gray-10)">Run Script</h6>
              <CodeMirror
                value={option.run_script}
                className="h-30 rounded-md border border-(--gray-4) overflow-hidden mt-1.5"
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      popoverContentClasses="max-h-60 bg-(--gray-1) border border-(--gray-5) shadow-xl shadow-black/5 rounded-lg p-2"
    >
      {({ options, handleOnAdd, highlightedIndex, getItemId }) => (
        <div className="flex flex-col gap-1">
          {options.map((option, index) => (
            <div
              key={getItemId(index)}
              id={getItemId(index)}
              className={cn(
                "w-full text-left p-2 rounded-md cursor-pointer transition-all duration-150",
                index === highlightedIndex
                  ? "bg-(--accent-color)/10"
                  : "hover:bg-(--gray-2)",
              )}
              onClick={() => handleOnAdd(option)}
            >
              <div className="flex items-center gap-2">
                <Server
                  size="14"
                  className={cn(
                    "transition-colors duration-150",
                    index === highlightedIndex
                      ? "text-(--accent-color)"
                      : "text-(--gray-8)",
                  )}
                />
                <h5
                  className={cn(
                    "text-sm font-medium",
                    index === highlightedIndex
                      ? "text-(--accent-color)"
                      : "text-(--gray-11)",
                  )}
                >
                  {option.name}
                </h5>
              </div>
              <h6 className="text-xs mt-1.5 text-(--gray-10)">Build Script</h6>
              <CodeMirror
                value={option.build_script}
                className="h-30 rounded-md border border-(--gray-4) overflow-hidden mt-1"
              />
              <h6 className="text-xs mt-1.5 text-(--gray-10)">Run Script</h6>
              <CodeMirror
                value={option.run_script}
                className="h-30 rounded-md border border-(--gray-4) overflow-hidden mt-1"
              />
            </div>
          ))}
        </div>
      )}
    </AutoComplete>
  );
}

export default AllowedRunners;
