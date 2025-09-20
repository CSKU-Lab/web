import { cn } from "~/lib/utils";
import useFilter from "./useFilter";
import AddFilter from "./AddFilter";
import FilterBlock from "./FilterBlock";
import type { FilterField, IFilter } from "~/types/filter";
import { useEffect } from "react";
import { isValidFilter } from "./utils/is-valid-filter";

interface Props {
  className?: string;
  fields: FilterField[];
  onChange?: (value: IFilter[]) => void;
}

function Filter({ className, fields, onChange }: Props) {
  const { filters } = useFilter();

  useEffect(() => {
    if (filters.some((filter) => !isValidFilter(filter))) return;
    if (onChange) {
      onChange(filters);
    }
  }, [filters, onChange]);

  return (
    <div
      className={cn("flex items-center flex-wrap gap-x-1.5 gap-y-2", className)}
    >
      {filters.map((filter) => (
        <FilterBlock
          key={`${filter.field.value}-${filter.status}`}
          filter={filter}
        />
      ))}
      <AddFilter fields={fields} />
    </div>
  );
}

export default Filter;
