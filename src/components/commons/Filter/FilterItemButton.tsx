import { X } from "lucide-react";
import { Button } from "~/components/commons/Button";
import type { Filter } from "~/types/filter";
import useFilter from "./useFilter";

function FilterItemButton({ field, operator, value }: Filter) {
  const { remove } = useFilter();

  return (
    <Button className="flex items-center gap-1.5 text-(--gray-12) text-xs rounded-md bg-(--gray-4) px-2 py-1 mr-2 font-semibold">
      {field} <span className="text-(--gray-11) font-normal">{operator}</span>{" "}
      <div className="truncate">{value}</div>
      <X size="0.75rem" onClick={() => remove(field)} />
    </Button>
  );
}

export default FilterItemButton;
