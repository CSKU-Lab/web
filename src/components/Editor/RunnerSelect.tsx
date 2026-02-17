import SearchSelect from "~/components/commons/SearchSelect";
import { cn } from "~/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Runner } from "./types/runner";

interface Props {
  runners: Runner[];
  selectedRunner: Runner | null;
  onSelect: (runner: Runner) => void;
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
  queryFn?: (query: string) => Promise<Runner[]>;
}

function RunnerSelect({
  runners,
  selectedRunner,
  onSelect,
  isLoading,
  isError,
  disabled,
  queryFn,
}: Props) {
  return (
    <Tooltip open={isError}>
      <TooltipTrigger asChild>
        <div>
          <SearchSelect<Runner>
            value={selectedRunner}
            options={runners}
            queryFn={queryFn}
            placeholder="Search runners..."
            emptyPlaceholder="Select a runner..."
            isError={isError}
            disabled={disabled || isLoading}
            customValueRender={(runner) => `Runner: ${runner.name}`}
            className={cn(
              "h-6 text-xs w-48",
              isError && "border-red-500",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            {(filteredRunners) => (
              <>
                {filteredRunners.map((runner) => (
                  <div
                    key={runner.id}
                    onClick={() => onSelect(runner)}
                    className="px-2 py-1.5 text-sm cursor-pointer hover:bg-(--gray-3) rounded-sm"
                  >
                    {runner.name}
                  </div>
                ))}
              </>
            )}
          </SearchSelect>
        </div>
      </TooltipTrigger>
      <TooltipContent>You forget to set a runner</TooltipContent>
    </Tooltip>
  );
}

export default RunnerSelect;
