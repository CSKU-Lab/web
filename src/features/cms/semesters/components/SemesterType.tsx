import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import { cn } from "~/lib/utils";

interface Props {
  value: "first" | "second" | "summer";
  onChange: (value: "first" | "second" | "summer") => void;
  isError: boolean;
}
function SemesterType({ value, onChange, isError }: Props) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger
        className={cn(
          "relative w-full h-9",
          isError && "border-(--red-9)",
        )}
      >
        <SelectValue />
        <ChevronDown size="1rem" className="text-(--gray-11)" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="first">First</SelectItem>
        <SelectItem value="second">Second</SelectItem>
        <SelectItem value="summer">Summer</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default SemesterType;
