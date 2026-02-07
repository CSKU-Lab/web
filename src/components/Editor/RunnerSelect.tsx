import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import { cn } from "~/lib/tiptap-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Runner } from "./types/runner";

interface Props {
  runners: Runner[];
  selectedRunnerID: string;
  onSelect: (runnerID: string) => void;
  isLoading?: boolean;
  isError?: boolean;
  disabled?: boolean;
}
function RunnerSelect({
  runners,
  selectedRunnerID,
  onSelect,
  isLoading,
  isError,
  disabled,
}: Props) {
  return (
    <Tooltip open={isError}>
      <Select value={selectedRunnerID} onValueChange={onSelect} disabled={disabled}>
        <TooltipTrigger asChild>
          <SelectTrigger
            className={cn("h-6 z-20 text-xs", isError && "border-red-500", disabled && "opacity-50 cursor-not-allowed")}
          >
            <span className="mr-1">Runner:</span>
            <SelectValue placeholder="Select a runner" />
          </SelectTrigger>
        </TooltipTrigger>
        <SelectContent>
          {isLoading && (
            <div className="p-2 text-center text-xs text-(--gray-11)">
              Loading...
            </div>
          )}
          {runners?.map((runner) => (
            <SelectItem key={runner.id} value={runner.id}>
              {runner.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <TooltipContent>You forget to set a runner</TooltipContent>
    </Tooltip>
  );
}

export default RunnerSelect;
