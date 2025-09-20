import { cn } from "~/lib/utils";
import useFilter from "./useFilter";
import AddFilter from "./AddFilter";
import FilterBlock from "./FilterBlock";
import type { FilterField } from "~/types/filter";
import { useEffect, useMemo } from "react";
import { isValidFilter } from "./utils/is-valid-filter";

interface Props {
  className?: string;
  fields: FilterField[];
  value: string;
  onChange?: (value: string) => void;
}

function Filter({ className, fields, onChange }: Props) {
  const { filters } = useFilter();

  const filteredFields = useMemo(
    () =>
      fields.filter(
        (field) =>
          !filters.some((filter) => filter.field.value === field.value),
      ),
    [fields, filters],
  );

  useEffect(() => {
    if (filters.some((filter) => !isValidFilter(filter))) return;
    if (onChange) {
      const query = filters
        .map((filter) => {
          return `${filter.field.value}__${filter.operator}=${encodeURIComponent(filter.value)}`;
        })
        .join("&");
      onChange(query);
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
      <AddFilter fields={filteredFields} />
    </div>
  );
}

export default Filter;
