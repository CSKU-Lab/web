import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import { useGetRunners } from "../../_hooks/useGetRunners";
import { useAtom } from "jotai";
import { runnerStore } from "../../_stores/editor.store";

function LanguageSelect() {
  const { data: runners, isFetching } = useGetRunners();
  const [runner, setRunner] = useAtom(runnerStore);

  return (
    <Select value={runner} onValueChange={setRunner}>
      <SelectTrigger className="absolute h-6 right-2 top-2 z-20 text-xs">
        <SelectValue placeholder="Select a runner" />
      </SelectTrigger>
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
  );
}

export default LanguageSelect;
