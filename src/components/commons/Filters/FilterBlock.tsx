import { Button } from "~/components/commons/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/commons/Popover";
import useFilter from "./useFilter";
import type { IFilter } from "~/types/filter";
import Operator from "./Operator";
import Input from "~/components/commons/Input";
import { useState } from "react";
import { mapDisplayWithValue } from "./utils/map-display-with-value";

interface Props {
  filter: IFilter;
}

function FilterBlock({ filter }: Props) {
  const {
    field,
    operator: initialOperator,
    value: initialValue,
    status,
  } = filter;
  const { remove, update } = useFilter();

  const [isOpen, setIsOpen] = useState(status === "newly-created");
  const [operator, setOperator] = useState(initialOperator);
  const [value, setValue] = useState(initialValue);

  const handleOnApply = () => {
    update({ ...filter, operator, value });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="flex items-center gap-1.5 text-(--gray-12) text-xs rounded-md px-2 py-1 font-semibold">
          {field.display}
          <span className="text-(--gray-11) font-normal">
            {mapDisplayWithValue[operator]}
          </span>{" "}
          <div className="truncate">{value}</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 max-w-100" align="start">
        <div className="flex items-center gap-1">
          <h6 className="text-xs">{field.display}</h6>
          <Operator value={operator} onChange={setOperator} />
        </div>
        <Input
          className="h-8 bg-white mt-1.5"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleOnApply}
        />
        <div className="flex gap-2 mt-2">
          <Button onClick={handleOnApply} variant="action" className="flex-1">
            Apply
          </Button>
          <Button onClick={() => remove(field.value)} className="flex-1">
            Remove
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default FilterBlock;
