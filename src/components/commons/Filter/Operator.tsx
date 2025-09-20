import { ChevronDown } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/commons/Select";
import type { FilterOperator } from "~/types/filter";

interface Props {
  value: FilterOperator;
  onChange: (operator: FilterOperator) => void;
}

function Operator({ value, onChange }: Props) {
  return (
    <Select
      value={value}
      onValueChange={(val) => onChange(val as FilterOperator)}
    >
      <SelectTrigger className="group" asChild>
        <Button className="flex" variant="ghost">
          <SelectValue className="shrink-0" />
          <ChevronDown
            size="1rem"
            className="group-data-[state='open']:rotate-180 transition-transform"
          />
        </Button>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="is">is</SelectItem>
        <SelectItem value="is_not">is not</SelectItem>
        <SelectItem value="contains">contains</SelectItem>
        <SelectItem value="not_contains">not contains</SelectItem>
        <SelectItem value="is_empty">is empty</SelectItem>
        <SelectItem value="is_not_empty">is not empty</SelectItem>
        <SelectItem value="lt">&lt;</SelectItem>
        <SelectItem value="lte">&lt;=</SelectItem>
        <SelectItem value="gt">&gt;</SelectItem>
        <SelectItem value="gte">&gt;=</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default Operator;
