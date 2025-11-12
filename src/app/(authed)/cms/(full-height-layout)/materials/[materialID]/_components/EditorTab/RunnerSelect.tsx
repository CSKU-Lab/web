import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import { useGetRunners } from "../../_hooks/useGetRunners";
import { useAtom, useAtomValue } from "jotai";
import { errorStore, runnerStore } from "../../_stores/editor.store";
import { cn } from "~/lib/tiptap-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

function RunnerSelect() {
  const { data: runners, isFetching } = useGetRunners();
  const [runner, setRunner] = useAtom(runnerStore);
  const [error, setError] = useAtom(errorStore);
  const isError = error === "NO_RUNNER";

  const handleOnValueChange = (value: string) => {
    setError(null);
    setRunner(value);
  };

  return (
    <Tooltip open={isError}>
      <Select value={runner} onValueChange={handleOnValueChange}>
        <TooltipTrigger asChild>
          <SelectTrigger
            className={cn(
              "absolute h-6 right-2 top-2 z-20 text-xs",
              isError && "border-red-500",
            )}
          >
            <SelectValue placeholder="Select a runner" />
          </SelectTrigger>
        </TooltipTrigger>
        <SelectContent>
          {isFetching && (
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
