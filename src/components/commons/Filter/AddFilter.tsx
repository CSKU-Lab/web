import { useState, useEffect, useMemo } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/commons/Popover";
import SearchInput from "~/components/commons/SearchInput";
import useFilter from "./useFilter";
import { Button } from "~/components/commons/Button";
import { Plus } from "lucide-react";
import type { FilterField } from "~/types/filter";

interface Props {
  fields: FilterField[];
}

const AddFilterButton = ({ fields }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const filteredFields = useMemo(
    () =>
      fields.filter((field) =>
        field.display.toLowerCase().includes(search.toLowerCase()),
      ),
    [fields, search],
  );

  const { add } = useFilter();
  const handleOnSelectField = (field: FilterField) => {
    add(field);
    setOpen(false);
    setSearch("");
    setSelectedIndex(-1);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredFields.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredFields.length - 1 ? prev + 1 : 0,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredFields.length - 1,
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      handleOnSelectField(filteredFields[selectedIndex]);
    }
  };

  const handleOnChangeInput = (value: string) => {
    setSearch(value);
    setSelectedIndex(0);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 w-fit py-1">
          <Plus size="1rem" />
          Add Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="p-2"
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <SearchInput
          value={search}
          onChange={handleOnChangeInput}
          onKeyDown={handleInputKeyDown}
          className="w-full"
        />
        <div className="mt-1.5 space-y-1.5">
          {filteredFields.map((field, index) => (
            <button
              key={field.value}
              onClick={() => handleOnSelectField(field)}
              data-state={selectedIndex === index ? "selected" : "default"}
              className="w-full text-xs py-1.5 text-left hover:bg-(--gray-3) rounded-md px-2 data-[state=selected]:bg-(--accent-color) data-[state=selected]:text-(--text-base-color)"
            >
              {field.display}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddFilterButton;
