import { X } from "lucide-react";
import { Button } from "~/components/commons/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/commons/Popover";
import useFilter from "./useFilter";
import type { Filter, FilterOperator } from "~/types/filter";
import Operator from "./Operator";
import Input from "~/components/commons/Input";
import { useRef, useState } from "react";
import { mapDisplayWithValue } from "./utils/map-display-with-value";

interface Props {
  filter: Filter;
}

function FilterBlock({ filter }: Props) {
  const { field, operator, value, status } = filter;
  const { remove, update } = useFilter();

  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(status === "newly-created");

  const handleOnChangeInput = () => {
    update({ ...filter, value: inputValue });
  };

  const inputValueRef = useRef<HTMLInputElement>(null);
  const handleOnKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleOnChangeInput();
      inputValueRef.current?.blur();
      setIsOpen(false);
    }
  };

  const handleOnChangeOperator = (operator: FilterOperator) => {
    update({ ...filter, operator });
  };

  const handleOnOpenChange = (isOpen: boolean) => {
    if (inputValue !== "") {
      handleOnChangeInput();
    }
    setIsOpen(isOpen);
  };
  return (
    <Popover open={isOpen} onOpenChange={handleOnOpenChange}>
      <PopoverTrigger asChild>
        <Button className="flex items-center gap-1.5 text-(--gray-12) text-xs rounded-md px-2 py-1 font-semibold">
          {field.display}
          <span className="text-(--gray-11) font-normal">
            {mapDisplayWithValue[operator]}
          </span>{" "}
          <div className="truncate">{value}</div>
          <X size="0.75rem" onClick={() => remove(field.value)} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-2 max-w-100" align="start">
        <div className="flex items-center gap-1">
          <h6 className="text-xs">{field.display}</h6>
          <Operator value={operator} onChange={handleOnChangeOperator} />
        </div>
        <Input
          ref={inputValueRef}
          className="h-8 bg-white mt-1.5"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleOnChangeInput}
          onKeyDown={handleOnKeyDownInput}
        />
      </PopoverContent>
    </Popover>
  );
}

export default FilterBlock;
