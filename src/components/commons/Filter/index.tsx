import { cn } from "~/lib/utils";
import useFilter from "./useFilter";
import AddFilter from "./AddFilter";
import FilterBlock from "./FilterBlock";
import type { FilterField } from "~/types/filter";
import { useMemo } from "react";

interface Props {
  className?: string;
  fields: FilterField[];
}

function Filter({ className, fields }: Props) {
  const { filters } = useFilter();
  console.log(filters);

  const filteredFields = useMemo(
    () =>
      fields.filter(
        (field) =>
          !filters.some((filter) => filter.field.value === field.value),
      ),
    [fields, filters],
  );

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
      <AddFilter fields={filteredFields} />
    </div>
  );
}

export default Filter;
